-- Luna Hijab Supabase schema
-- Run in Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  gender text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  sku text unique,
  short_description text,
  description text,
  material text,
  care_instruction text,
  price numeric(12, 2) not null check (price >= 0),
  sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
  discount_percentage int check (discount_percentage is null or discount_percentage between 0 and 100),
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_active boolean not null default true,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_name text not null,
  color_hex text,
  size text,
  variant_sku text unique,
  additional_price numeric(12, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid not null unique references public.product_variants(id) on delete cascade,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  low_stock_threshold int not null default 5 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity int not null default 1 check (quantity > 0),
  price_snapshot numeric(12, 2) not null check (price_snapshot >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id, variant_id)
);

create table if not exists public.shipping_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  province text not null,
  city text not null,
  district text,
  postal_code text,
  full_address text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid not null references public.users(id) on delete restrict,
  shipping_address_id uuid references public.shipping_addresses(id) on delete set null,
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'paid', 'processing', 'packed', 'shipped', 'completed', 'cancelled', 'refunded')
  ),
  payment_method text not null check (payment_method in ('bank_transfer', 'cod', 'e_wallet_dummy')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  shipping_cost numeric(12, 2) not null default 0 check (shipping_cost >= 0),
  discount_amount numeric(12, 2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  customer_notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_snapshot text not null,
  variant_snapshot text,
  price_snapshot numeric(12, 2) not null check (price_snapshot >= 0),
  quantity int not null check (quantity > 0),
  total_price numeric(12, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_product_wishlist unique (user_id, product_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(12, 2) not null check (value >= 0),
  min_purchase numeric(12, 2) not null default 0 check (min_purchase >= 0),
  max_discount numeric(12, 2),
  usage_limit int,
  used_count int not null default 0,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  placement text not null check (placement in ('hero', 'shop', 'promo')),
  is_active boolean not null default true,
  start_date timestamptz,
  end_date timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_is_active on public.categories(is_active);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_products_is_best_seller on public.products(is_best_seller);
create index if not exists idx_products_created_at on public.products(created_at);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_is_primary on public.product_images(is_primary);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_variants_variant_sku on public.product_variants(variant_sku);
create index if not exists idx_inventory_product_id on public.inventory(product_id);
create index if not exists idx_inventory_variant_id on public.inventory(variant_id);
create index if not exists idx_inventory_stock_quantity on public.inventory(stock_quantity);
create index if not exists idx_carts_user_id on public.carts(user_id);
create index if not exists idx_carts_status on public.carts(status);
create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_cart_items_product_id on public.cart_items(product_id);
create index if not exists idx_cart_items_variant_id on public.cart_items(variant_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);
create index if not exists idx_order_items_variant_id on public.order_items(variant_id);
create index if not exists idx_shipping_addresses_user_id on public.shipping_addresses(user_id);
create index if not exists idx_shipping_addresses_is_default on public.shipping_addresses(is_default);
create index if not exists idx_wishlists_user_id on public.wishlists(user_id);
create index if not exists idx_wishlists_product_id on public.wishlists(product_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_is_approved on public.reviews(is_approved);
create index if not exists idx_reviews_rating on public.reviews(rating);
create index if not exists idx_coupons_code on public.coupons(code);
create index if not exists idx_coupons_is_active on public.coupons(is_active);
create index if not exists idx_coupons_end_date on public.coupons(end_date);
create index if not exists idx_banners_placement on public.banners(placement);
create index if not exists idx_banners_is_active on public.banners(is_active);
create index if not exists idx_banners_start_end_date on public.banners(start_date, end_date);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_inventory_updated_at on public.inventory;
create trigger trg_inventory_updated_at before update on public.inventory
for each row execute function public.set_updated_at();

drop trigger if exists trg_carts_updated_at on public.carts;
create trigger trg_carts_updated_at before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists trg_cart_items_updated_at on public.cart_items;
create trigger trg_cart_items_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_shipping_addresses_updated_at on public.shipping_addresses;
create trigger trg_shipping_addresses_updated_at before update on public.shipping_addresses
for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = user_uuid
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'customer'))
  on conflict (id) do nothing;

  insert into public.profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.shipping_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;

create policy "users can read own account" on public.users
for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "users can update own account" on public.users
for update using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));
create policy "authenticated can insert own user mirror" on public.users
for insert with check (auth.uid() = id);

create policy "profiles own or admin read" on public.profiles
for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "profiles own or admin write" on public.profiles
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "public read active categories" on public.categories
for select using (is_active = true or public.is_admin(auth.uid()));
create policy "admin manage categories" on public.categories
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read active products" on public.products
for select using (is_active = true or public.is_admin(auth.uid()));
create policy "admin manage products" on public.products
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read active product images" on public.product_images
for select using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
  or public.is_admin(auth.uid())
);
create policy "admin manage product images" on public.product_images
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read active variants" on public.product_variants
for select using (
  is_active = true
  and exists (
    select 1 from public.products
    where products.id = product_variants.product_id
      and products.is_active = true
  )
  or public.is_admin(auth.uid())
);
create policy "admin manage variants" on public.product_variants
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read inventory for active products" on public.inventory
for select using (
  exists (
    select 1 from public.products
    where products.id = inventory.product_id
      and products.is_active = true
  )
  or public.is_admin(auth.uid())
);
create policy "admin manage inventory" on public.inventory
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "customers manage own carts" on public.carts
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "customers manage own cart items" on public.cart_items
for all using (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
  or public.is_admin(auth.uid())
)
with check (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
  or public.is_admin(auth.uid())
);

create policy "customers manage own addresses" on public.shipping_addresses
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "customers read own orders" on public.orders
for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "customers create own orders" on public.orders
for insert with check (auth.uid() = user_id);
create policy "admin update orders" on public.orders
for update using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "customers read own order items" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
  or public.is_admin(auth.uid())
);
create policy "customers create own order items" on public.order_items
for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "customers manage own wishlists" on public.wishlists
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "public read approved reviews" on public.reviews
for select using (is_approved = true or auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "customers create own reviews" on public.reviews
for insert with check (auth.uid() = user_id);
create policy "customers update own pending reviews" on public.reviews
for update using (auth.uid() = user_id and is_approved = false)
with check (auth.uid() = user_id and is_approved = false);
create policy "admin manage reviews" on public.reviews
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "admin manage coupons" on public.coupons
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read active banners" on public.banners
for select using (
  is_active = true
  and (start_date is null or start_date <= now())
  and (end_date is null or end_date >= now())
  or public.is_admin(auth.uid())
);
create policy "admin manage banners" on public.banners
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into public.categories (name, slug, description, sort_order)
values
  ('Pashmina', 'pashmina', 'Flowy essentials for campus, office, and travel days.', 1),
  ('Square Hijab', 'square-hijab', 'Clean structure with soft edges for everyday styling.', 2),
  ('Instant Hijab', 'instant-hijab', 'Ready-to-wear hijab for busy morning routines.', 3),
  ('Premium Collection', 'premium-collection', 'Elevated fabrics, muted colors, and refined finishing.', 4)
on conflict (slug) do nothing;

-- Storage buckets to create in Supabase dashboard:
-- product-images: public read, admin upload/update/delete
-- banner-images: public read, admin upload/update/delete
-- avatars: public read, user-scoped upload/update/delete
