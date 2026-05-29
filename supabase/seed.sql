-- Luna Hijab demo seed data
-- Run after supabase/schema.sql.

insert into public.categories (name, slug, description, sort_order)
values
  ('Pashmina', 'pashmina', 'Flowy essentials for campus, office, and travel days.', 1),
  ('Square Hijab', 'square-hijab', 'Clean structure with soft edges for everyday styling.', 2),
  ('Instant Hijab', 'instant-hijab', 'Ready-to-wear hijab for busy morning routines.', 3),
  ('Premium Collection', 'premium-collection', 'Elevated fabrics, muted colors, and refined finishing.', 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.products (
  category_id,
  name,
  slug,
  sku,
  short_description,
  description,
  material,
  care_instruction,
  price,
  sale_price,
  is_featured,
  is_best_seller,
  is_new_arrival,
  is_active,
  is_available
)
values
  (
    (select id from public.categories where slug = 'pashmina'),
    'Luna Soft Pashmina',
    'luna-soft-pashmina',
    'LH-PSM-001',
    'Soft matte pashmina with an elegant fall and airy touch.',
    'Designed for active daily routines, Luna Soft Pashmina uses breathable premium voal blend that sits neatly without feeling heavy.',
    'Premium voal blend',
    'Hand wash cold, dry flat, iron low heat.',
    129000,
    109000,
    true,
    true,
    true,
    true,
    true
  ),
  (
    (select id from public.categories where slug = 'square-hijab'),
    'Noura Square Voal',
    'noura-square-voal',
    'LH-SQ-002',
    'Square hijab with crisp drape and polished finish.',
    'A reliable daily square hijab with clean opacity, soft texture, and colors curated for capsule wardrobes.',
    'Ultrafine voal',
    'Machine wash gentle, use mild detergent.',
    99000,
    null,
    true,
    true,
    false,
    true,
    true
  ),
  (
    (select id from public.categories where slug = 'instant-hijab'),
    'Ayla Instant Daily',
    'ayla-instant-daily',
    'LH-IN-003',
    'No-pin instant hijab for commuting and errands.',
    'A practical instant hijab that keeps the premium look with a secure face opening and lightweight jersey.',
    'Premium jersey',
    'Wash with similar colors, do not bleach.',
    149000,
    null,
    false,
    false,
    true,
    true,
    true
  ),
  (
    (select id from public.categories where slug = 'premium-collection'),
    'Serene Silk Touch',
    'serene-silk-touch',
    'LH-PR-004',
    'Premium sheen hijab for events, dinners, and formal wear.',
    'A refined silk-touch hijab with subtle luminosity, built for special occasions without sacrificing comfort.',
    'Silk-touch satin',
    'Dry clean recommended, steam gently.',
    189000,
    169000,
    true,
    false,
    true,
    true,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  sku = excluded.sku,
  short_description = excluded.short_description,
  description = excluded.description,
  material = excluded.material,
  care_instruction = excluded.care_instruction,
  price = excluded.price,
  sale_price = excluded.sale_price,
  is_featured = excluded.is_featured,
  is_best_seller = excluded.is_best_seller,
  is_new_arrival = excluded.is_new_arrival,
  is_active = true,
  is_available = true;

insert into public.product_variants (
  product_id,
  color_name,
  color_hex,
  size,
  variant_sku,
  additional_price,
  is_active
)
values
  ((select id from public.products where slug = 'luna-soft-pashmina'), 'Ivory', '#F5EDE2', '180 x 75 cm', 'LH-PSM-001-IVORY', 0, true),
  ((select id from public.products where slug = 'luna-soft-pashmina'), 'Dusty Pink', '#D8A7A7', '180 x 75 cm', 'LH-PSM-001-DPINK', 0, true),
  ((select id from public.products where slug = 'luna-soft-pashmina'), 'Sage', '#9BAA8C', '180 x 75 cm', 'LH-PSM-001-SAGE', 0, true),
  ((select id from public.products where slug = 'noura-square-voal'), 'Nude', '#DCC6B2', '110 x 110 cm', 'LH-SQ-002-NUDE', 0, true),
  ((select id from public.products where slug = 'noura-square-voal'), 'Black', '#171412', '110 x 110 cm', 'LH-SQ-002-BLACK', 0, true),
  ((select id from public.products where slug = 'ayla-instant-daily'), 'Taupe', '#B09882', 'M', 'LH-IN-003-TAUPE-M', 0, true),
  ((select id from public.products where slug = 'ayla-instant-daily'), 'Charcoal', '#4D4A45', 'L', 'LH-IN-003-CHAR-L', 0, true),
  ((select id from public.products where slug = 'serene-silk-touch'), 'Champagne', '#E7D3B5', '180 x 75 cm', 'LH-PR-004-CHAMP', 0, true),
  ((select id from public.products where slug = 'serene-silk-touch'), 'Rosewood', '#A96C78', '180 x 75 cm', 'LH-PR-004-ROSE', 0, true)
on conflict (variant_sku) do update set
  color_name = excluded.color_name,
  color_hex = excluded.color_hex,
  size = excluded.size,
  additional_price = excluded.additional_price,
  is_active = true;

insert into public.inventory (product_id, variant_id, stock_quantity, low_stock_threshold)
select
  pv.product_id,
  pv.id,
  case pv.variant_sku
    when 'LH-PSM-001-IVORY' then 18
    when 'LH-PSM-001-DPINK' then 7
    when 'LH-PSM-001-SAGE' then 4
    when 'LH-SQ-002-NUDE' then 16
    when 'LH-SQ-002-BLACK' then 12
    when 'LH-IN-003-TAUPE-M' then 9
    when 'LH-IN-003-CHAR-L' then 5
    when 'LH-PR-004-CHAMP' then 8
    when 'LH-PR-004-ROSE' then 2
    else 0
  end as stock_quantity,
  5 as low_stock_threshold
from public.product_variants pv
where pv.variant_sku in (
  'LH-PSM-001-IVORY',
  'LH-PSM-001-DPINK',
  'LH-PSM-001-SAGE',
  'LH-SQ-002-NUDE',
  'LH-SQ-002-BLACK',
  'LH-IN-003-TAUPE-M',
  'LH-IN-003-CHAR-L',
  'LH-PR-004-CHAMP',
  'LH-PR-004-ROSE'
)
on conflict (variant_id) do update set
  stock_quantity = excluded.stock_quantity,
  low_stock_threshold = excluded.low_stock_threshold,
  updated_at = now();
