-- Luna Hijab production hardening
-- Run after supabase/schema.sql and supabase/seed.sql.
-- Adds atomic checkout RPC, stricter RLS policies, admin write paths, and storage policies.

create extension if not exists "pgcrypto";

create or replace function public.generate_order_number()
returns text
language sql
as $$
  select 'ORD-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
$$;

create or replace function public.create_order_from_cart(
  p_items jsonb,
  p_shipping jsonb,
  p_payment_method text,
  p_customer_notes text default null,
  p_shipping_cost numeric default 0,
  p_discount_amount numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text := auth.jwt() ->> 'email';
  v_order_id uuid;
  v_order_number text;
  v_shipping_address_id uuid;
  v_subtotal numeric := 0;
  v_total numeric := 0;
  v_item record;
  v_product record;
  v_variant record;
  v_inventory record;
  v_price numeric;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_payment_method not in ('bank_transfer', 'cod', 'e_wallet_dummy') then
    raise exception 'Invalid payment method';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.users (id, email, role)
  values (v_user_id, coalesce(v_user_email, 'unknown@example.com'), 'customer')
  on conflict (id) do nothing;

  create temp table if not exists pg_temp.checkout_lines (
    product_id uuid,
    variant_id uuid,
    product_name text,
    variant_name text,
    unit_price numeric,
    quantity int,
    total_price numeric
  ) on commit drop;

  truncate table pg_temp.checkout_lines;

  for v_item in
    select *
    from jsonb_to_recordset(p_items) as x(product_id uuid, variant_id uuid, quantity int)
  loop
    if v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select *
    into v_product
    from public.products
    where id = v_item.product_id
      and is_active = true
      and is_available = true;

    if not found then
      raise exception 'Product is not available';
    end if;

    select *
    into v_variant
    from public.product_variants
    where id = v_item.variant_id
      and product_id = v_item.product_id
      and is_active = true;

    if not found then
      raise exception 'Product variant is not available';
    end if;

    select *
    into v_inventory
    from public.inventory
    where variant_id = v_item.variant_id
    for update;

    if not found then
      raise exception 'Inventory is missing';
    end if;

    if v_inventory.stock_quantity < v_item.quantity then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    v_price := coalesce(v_product.sale_price, v_product.price) + coalesce(v_variant.additional_price, 0);

    insert into pg_temp.checkout_lines (
      product_id,
      variant_id,
      product_name,
      variant_name,
      unit_price,
      quantity,
      total_price
    )
    values (
      v_item.product_id,
      v_item.variant_id,
      v_product.name,
      concat_ws(' / ', v_variant.color_name, v_variant.size),
      v_price,
      v_item.quantity,
      v_price * v_item.quantity
    );

    v_subtotal := v_subtotal + (v_price * v_item.quantity);
  end loop;

  v_total := greatest(0, v_subtotal + coalesce(p_shipping_cost, 0) - coalesce(p_discount_amount, 0));

  insert into public.shipping_addresses (
    user_id,
    recipient_name,
    phone,
    province,
    city,
    district,
    postal_code,
    full_address,
    is_default
  )
  values (
    v_user_id,
    coalesce(p_shipping ->> 'fullName', p_shipping ->> 'recipient_name', 'Customer'),
    coalesce(p_shipping ->> 'phone', ''),
    coalesce(p_shipping ->> 'province', ''),
    coalesce(p_shipping ->> 'city', ''),
    nullif(p_shipping ->> 'district', ''),
    nullif(coalesce(p_shipping ->> 'postalCode', p_shipping ->> 'postal_code'), ''),
    coalesce(p_shipping ->> 'fullAddress', p_shipping ->> 'full_address', ''),
    false
  )
  returning id into v_shipping_address_id;

  v_order_number := public.generate_order_number();

  insert into public.orders (
    order_number,
    user_id,
    shipping_address_id,
    status,
    payment_method,
    payment_status,
    subtotal,
    shipping_cost,
    discount_amount,
    total_amount,
    customer_notes
  )
  values (
    v_order_number,
    v_user_id,
    v_shipping_address_id,
    'pending_payment',
    p_payment_method,
    'unpaid',
    v_subtotal,
    coalesce(p_shipping_cost, 0),
    coalesce(p_discount_amount, 0),
    v_total,
    p_customer_notes
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    variant_id,
    product_name_snapshot,
    variant_snapshot,
    price_snapshot,
    quantity,
    total_price
  )
  select
    v_order_id,
    product_id,
    variant_id,
    product_name,
    variant_name,
    unit_price,
    quantity,
    total_price
  from pg_temp.checkout_lines;

  update public.inventory inventory
  set stock_quantity = inventory.stock_quantity - checkout_lines.quantity,
      updated_at = now()
  from pg_temp.checkout_lines
  where inventory.variant_id = checkout_lines.variant_id;

  update public.carts
  set status = 'converted',
      updated_at = now()
  where user_id = v_user_id
    and status = 'active';

  return (
    select jsonb_build_object(
      'id', orders.id,
      'order_number', orders.order_number,
      'user_id', orders.user_id,
      'date', orders.created_at,
      'status', orders.status,
      'payment_status', orders.payment_status,
      'payment_method', orders.payment_method,
      'total_amount', orders.total_amount,
      'order_items', coalesce(
        jsonb_agg(
          jsonb_build_object(
            'product_name_snapshot', order_items.product_name_snapshot,
            'variant_snapshot', order_items.variant_snapshot,
            'quantity', order_items.quantity,
            'price_snapshot', order_items.price_snapshot
          )
        ) filter (where order_items.id is not null),
        '[]'::jsonb
      )
    )
    from public.orders
    left join public.order_items on order_items.order_id = orders.id
    where orders.id = v_order_id
    group by orders.id
  );
end;
$$;

grant execute on function public.create_order_from_cart(jsonb, jsonb, text, text, numeric, numeric) to authenticated;

drop policy if exists "customers read own orders" on public.orders;
drop policy if exists "customers create own orders" on public.orders;
drop policy if exists "admin update orders" on public.orders;
drop policy if exists "customers read own order items" on public.order_items;
drop policy if exists "customers create own order items" on public.order_items;

create policy "customers read own orders" on public.orders
for select
to authenticated
using ((select auth.uid()) is not null and ((select auth.uid()) = user_id or public.is_admin((select auth.uid()))));

create policy "customers create own orders" on public.orders
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "admin update orders" on public.orders
for update
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "customers read own order items" on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and ((orders.user_id = (select auth.uid())) or public.is_admin((select auth.uid())))
  )
);

create policy "customers create own order items" on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "admin manage products" on public.products;
drop policy if exists "admin manage categories" on public.categories;
drop policy if exists "admin manage variants" on public.product_variants;
drop policy if exists "admin manage inventory" on public.inventory;
drop policy if exists "admin manage product images" on public.product_images;

create policy "admin manage products" on public.products
for all
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "admin manage categories" on public.categories
for all
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "admin manage variants" on public.product_variants
for all
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "admin manage inventory" on public.inventory
for all
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "admin manage product images" on public.product_images
for all
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('banner-images', 'banner-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "admin write product images" on storage.objects;
drop policy if exists "public read banner images" on storage.objects;
drop policy if exists "admin write banner images" on storage.objects;
drop policy if exists "users write own avatars" on storage.objects;
drop policy if exists "public read avatars" on storage.objects;

create policy "public read product images" on storage.objects
for select
using (bucket_id = 'product-images');

create policy "admin write product images" on storage.objects
for all
to authenticated
using (bucket_id = 'product-images' and public.is_admin((select auth.uid())))
with check (bucket_id = 'product-images' and public.is_admin((select auth.uid())));

create policy "public read banner images" on storage.objects
for select
using (bucket_id = 'banner-images');

create policy "admin write banner images" on storage.objects
for all
to authenticated
using (bucket_id = 'banner-images' and public.is_admin((select auth.uid())))
with check (bucket_id = 'banner-images' and public.is_admin((select auth.uid())));

create policy "public read avatars" on storage.objects
for select
using (bucket_id = 'avatars');

create policy "users write own avatars" on storage.objects
for all
to authenticated
using (bucket_id = 'avatars' and owner = (select auth.uid()))
with check (bucket_id = 'avatars' and owner = (select auth.uid()));
