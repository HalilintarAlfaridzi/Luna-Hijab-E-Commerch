import { categories as seedCategories, products, reviews } from "../data/mockData.js";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";
import { uploadProductImage } from "./storageService.js";
import { slugify } from "../utils/slugify.js";

const DRAFT_PRODUCTS_KEY = "luna-hijab-admin-product-drafts";
const DEMO_CATEGORIES_KEY = "luna-hijab-admin-categories";
const CATEGORY_TONES = [
  "from-[#E8D3C4] via-[#DAB29E] to-[#A8755B]",
  "from-[#F1DCE3] via-[#D6A2B0] to-[#8B5E6D]",
  "from-[#E8E8D7] via-[#B7C2A6] to-[#6F7B61]",
  "from-[#EFE2CE] via-[#C9A77D] to-[#6F4E37]",
  "from-[#F4E1D3] via-[#C08497] to-[#8B5E3C]",
];

function normalizeSeedCategories() {
  return seedCategories.map((category, index) => ({
    ...category,
    isActive: category.isActive ?? true,
    sortOrder: category.sortOrder ?? index + 1,
  }));
}

function readDemoCategories() {
  if (typeof window === "undefined") return normalizeSeedCategories();

  try {
    const stored = localStorage.getItem(DEMO_CATEGORIES_KEY);
    if (!stored) return normalizeSeedCategories();
    return JSON.parse(stored);
  } catch {
    return normalizeSeedCategories();
  }
}

function writeDemoCategories(nextCategories) {
  localStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(nextCategories));
}

function sortCategories(categoryList) {
  return [...categoryList].sort(
    (a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0) || a.name.localeCompare(b.name),
  );
}

function normalizeCategory(row, index = 0) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    imageUrl: row.image_url ?? row.imageUrl ?? null,
    imageTone: row.imageTone ?? CATEGORY_TONES[index % CATEGORY_TONES.length],
    isActive: row.is_active ?? row.isActive ?? true,
    sortOrder: row.sort_order ?? row.sortOrder ?? index + 1,
  };
}

function ensureUniqueSlug(baseSlug, categoryList, currentId = null) {
  let nextSlug = baseSlug || "category";
  let index = 2;

  while (categoryList.some((category) => category.slug === nextSlug && category.id !== currentId)) {
    nextSlug = `${baseSlug}-${index}`;
    index += 1;
  }

  return nextSlug;
}

function hydrateProduct(product, categoryList = readDemoCategories()) {
  const category = categoryList.find((item) => item.id === product.categoryId);
  const activeStock = product.variants.reduce((total, variant) => total + variant.stock, 0);

  return {
    ...product,
    category,
    activeStock,
    effectivePrice: product.salePrice ?? product.price,
  };
}

function normalizeSupabaseVariant(row) {
  const inventory = Array.isArray(row.inventory) ? row.inventory[0] : row.inventory;

  return {
    id: row.id,
    productId: row.product_id,
    colorName: row.color_name,
    colorHex: row.color_hex ?? "#D8BFA3",
    size: row.size ?? "Standard",
    variantSku: row.variant_sku,
    additionalPrice: Number(row.additional_price ?? 0),
    isActive: row.is_active ?? true,
    stock: Number(inventory?.stock_quantity ?? 0),
    lowStockThreshold: Number(inventory?.low_stock_threshold ?? 5),
  };
}

function makeSupabaseBadges(product) {
  const badges = [];
  if (product.sale_price) badges.push("Sale");
  if (product.is_best_seller) badges.push("Best Seller");
  if (product.is_new_arrival) badges.push("New");
  if (product.categories?.slug === "premium-collection") badges.push("Premium");
  return badges;
}

function normalizeSupabaseProduct(row, index = 0) {
  const category = row.categories ? normalizeCategory(row.categories, index) : null;
  const variants = (row.product_variants ?? [])
    .map(normalizeSupabaseVariant)
    .filter((variant) => variant.isActive);
  const safeVariants =
    variants.length > 0
      ? variants
      : [
          {
            id: `${row.id}-default`,
            productId: row.id,
            colorName: "Default",
            colorHex: "#D8BFA3",
            size: "Standard",
            stock: 0,
            isActive: true,
          },
        ];
  const price = Number(row.price ?? 0);
  const salePrice = row.sale_price === null || row.sale_price === undefined ? null : Number(row.sale_price);
  const activeStock = safeVariants.reduce((total, variant) => total + variant.stock, 0);
  const images = [...(row.product_images ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  );
  const primaryImageUrl = images[0]?.image_url ?? null;

  return {
    id: row.id,
    categoryId: row.category_id,
    category,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    material: row.material ?? "",
    careInstruction: row.care_instruction ?? "",
    price,
    salePrice,
    discountPercentage: row.discount_percentage,
    rating: Number(row.rating ?? 0),
    sold: Number(row.sold ?? 0),
    isFeatured: row.is_featured ?? false,
    isBestSeller: row.is_best_seller ?? false,
    isNewArrival: row.is_new_arrival ?? false,
    isActive: row.is_active ?? true,
    isAvailable: row.is_available ?? true,
    badges: makeSupabaseBadges(row),
    variants: safeVariants,
    images,
    primaryImageUrl,
    imageTone: category?.imageTone ?? CATEGORY_TONES[index % CATEGORY_TONES.length],
    activeStock,
    effectivePrice: salePrice ?? price,
  };
}

function applyProductFilters(list, params = {}) {
  const { category, search, sort, featured, bestSeller, newest } = params;
  let nextList = [...list];

  if (featured) nextList = nextList.filter((product) => product.isFeatured);
  if (bestSeller) nextList = nextList.filter((product) => product.isBestSeller);
  if (newest) nextList = nextList.filter((product) => product.isNewArrival);
  if (category) nextList = nextList.filter((product) => product.category?.slug === category);
  if (search) {
    const query = search.toLowerCase();
    nextList = nextList.filter((product) =>
      [product.name, product.shortDescription, product.description, product.category?.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }

  if (sort === "price-low") nextList.sort((a, b) => a.effectivePrice - b.effectivePrice);
  if (sort === "price-high") nextList.sort((a, b) => b.effectivePrice - a.effectivePrice);
  if (sort === "best-sellers") nextList.sort((a, b) => b.sold - a.sold);
  if (sort === "rating") nextList.sort((a, b) => b.rating - a.rating);
  if (sort === "latest") {
    nextList.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
  }

  return nextList;
}

function readDraftProducts() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(DRAFT_PRODUCTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeDraftProducts(nextProducts) {
  localStorage.setItem(DRAFT_PRODUCTS_KEY, JSON.stringify(nextProducts));
}

export async function getProducts(params = {}) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_variants(*, inventory(*))")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return applyProductFilters(data.map(normalizeSupabaseProduct), params);
  }

  const categoryList = readDemoCategories();
  return applyProductFilters(
    products.map((product) => hydrateProduct(product, categoryList)),
    params,
  );
}

export async function getProductBySlug(slug) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_variants(*, inventory(*))")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    return normalizeSupabaseProduct(data);
  }

  const categoryList = readDemoCategories();
  return products.map((product) => hydrateProduct(product, categoryList)).find((product) => product.slug === slug) ?? null;
}

export async function getCategories() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data.map(normalizeCategory);
  }

  return sortCategories(readDemoCategories().filter((category) => category.isActive !== false));
}

export async function getAdminProducts() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_variants(*, inventory(*))")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(normalizeSupabaseProduct);
  }

  const categoryList = readDemoCategories();
  return [
    ...getDemoProductDrafts(),
    ...products.map((product) => hydrateProduct(product, categoryList)),
  ];
}

export async function getApprovedReviews() {
  return reviews;
}

export function getDemoProductDrafts() {
  const categoryList = readDemoCategories();
  return readDraftProducts().map((product) => hydrateProduct(product, categoryList));
}

export function createDemoProductDraft(payload) {
  const categoryList = readDemoCategories();
  const selectedCategory = categoryList.find((category) => category.id === payload.categoryId) ?? categoryList[0];
  const productName = payload.name.trim();
  const sku = payload.sku.trim() || `LH-DRAFT-${Date.now().toString().slice(-5)}`;
  const slug = `${slugify(productName)}-${Date.now().toString().slice(-4)}`;
  const stock = Number(payload.stock || 0);

  const draftProduct = {
    id: `draft-${crypto.randomUUID()}`,
    categoryId: selectedCategory.id,
    name: productName,
    slug,
    sku,
    shortDescription: payload.shortDescription || "Draft product created from admin demo.",
    description: payload.shortDescription || "Draft product created from admin demo.",
    material: payload.material.trim() || "Premium voal blend",
    careInstruction: "Hand wash cold, dry flat, iron low heat.",
    price: Number(payload.price),
    salePrice: null,
    rating: 0,
    sold: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: false,
    isDraft: true,
    badges: ["Draft"],
    variants: [
      {
        colorName: payload.colorName.trim() || "Draft Color",
        colorHex: "#D8BFA3",
        size: payload.size.trim() || "180 x 75 cm",
        stock,
      },
    ],
    imageTone: selectedCategory.imageTone,
  };

  const nextProducts = [draftProduct, ...readDraftProducts()];
  writeDraftProducts(nextProducts);

  return hydrateProduct(draftProduct, categoryList);
}

function makeVariantSku(productSku, colorName) {
  return `${productSku || "LH"}-${slugify(colorName || "default").toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`;
}

export async function saveAdminProduct(payload, editingProduct = null) {
  if (!isSupabaseConfigured) {
    return createDemoProductDraft(payload);
  }

  const productName = payload.name.trim();
  const sku = payload.sku.trim() || `LH-${Date.now().toString().slice(-6)}`;
  const baseProduct = {
    category_id: payload.categoryId,
    name: productName,
    slug: editingProduct?.slug ?? `${slugify(productName)}-${Date.now().toString().slice(-4)}`,
    sku,
    short_description: payload.shortDescription || "Created from admin dashboard.",
    description: payload.shortDescription || "Created from admin dashboard.",
    material: payload.material.trim() || "Premium voal blend",
    care_instruction: "Hand wash cold, dry flat, iron low heat.",
    price: Number(payload.price),
    sale_price: null,
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: false,
    is_active: true,
    is_available: true,
  };

  const productResult = editingProduct
    ? await supabase.from("products").update(baseProduct).eq("id", editingProduct.id).select().single()
    : await supabase.from("products").insert(baseProduct).select().single();

  if (productResult.error) throw productResult.error;

  const productId = productResult.data.id;
  const firstVariant = editingProduct?.variants?.[0];
  const variantPayload = {
    product_id: productId,
    color_name: payload.colorName.trim() || "Default",
    color_hex: payload.colorHex || "#D8BFA3",
    size: payload.size.trim() || "Standard",
    variant_sku: firstVariant?.variantSku ?? makeVariantSku(sku, payload.colorName),
    additional_price: 0,
    is_active: true,
  };

  const variantResult = firstVariant?.id
    ? await supabase.from("product_variants").update(variantPayload).eq("id", firstVariant.id).select().single()
    : await supabase.from("product_variants").insert(variantPayload).select().single();

  if (variantResult.error) throw variantResult.error;

  const variantId = variantResult.data.id;
  const { error: inventoryError } = await supabase.from("inventory").upsert(
    {
      product_id: productId,
      variant_id: variantId,
      stock_quantity: Number(payload.stock || 0),
      low_stock_threshold: 5,
    },
    { onConflict: "variant_id" },
  );

  if (inventoryError) throw inventoryError;

  if (payload.imageFile) {
    const imageUrl = await uploadProductImage(payload.imageFile, productId);
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: productId,
      image_url: imageUrl,
      alt_text: productName,
      is_primary: true,
      sort_order: 0,
    });

    if (imageError) throw imageError;
  }

  return getProductBySlug(baseProduct.slug);
}

export async function archiveAdminProduct(productId) {
  if (!isSupabaseConfigured) return getDemoProductDrafts();

  const { error } = await supabase
    .from("products")
    .update({ is_active: false, is_available: false })
    .eq("id", productId);

  if (error) throw error;
  return getAdminProducts();
}

export function getDemoAdminCategories() {
  return sortCategories(readDemoCategories());
}

export async function getAdminCategories() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data.map(normalizeCategory);
  }

  return getDemoAdminCategories();
}

export async function saveAdminCategory(payload, editingId = null) {
  if (!isSupabaseConfigured) return saveDemoCategory(payload, editingId);

  const name = payload.name.trim();
  const categoryPayload = {
    name,
    slug: slugify(payload.slug.trim() || name),
    description: payload.description.trim() || "Created from admin dashboard.",
    sort_order: Number(payload.sortOrder || 0),
    is_active: true,
  };

  const result = editingId
    ? await supabase.from("categories").update(categoryPayload).eq("id", editingId).select().single()
    : await supabase.from("categories").insert(categoryPayload).select().single();

  if (result.error) throw result.error;
  return normalizeCategory(result.data);
}

export async function archiveAdminCategory(categoryId) {
  if (!isSupabaseConfigured) return archiveDemoCategory(categoryId);

  const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", categoryId);
  if (error) throw error;
  return getAdminCategories();
}

export async function restoreAdminCategory(categoryId) {
  if (!isSupabaseConfigured) return restoreDemoCategory(categoryId);

  const { error } = await supabase.from("categories").update({ is_active: true }).eq("id", categoryId);
  if (error) throw error;
  return getAdminCategories();
}

export async function updateInventoryStock(variantId, stockQuantity) {
  if (!isSupabaseConfigured) return null;

  const { error } = await supabase
    .from("inventory")
    .update({ stock_quantity: Number(stockQuantity) })
    .eq("variant_id", variantId);

  if (error) throw error;
  return true;
}

export function saveDemoCategory(payload, editingId = null) {
  const categoryList = readDemoCategories();
  const name = payload.name.trim();
  const rawSlug = payload.slug.trim() || slugify(name);
  const nextSlug = ensureUniqueSlug(slugify(rawSlug), categoryList, editingId);
  const sortOrder = Number(payload.sortOrder || categoryList.length + 1);

  if (editingId) {
    const nextCategories = categoryList.map((category) =>
      category.id === editingId
        ? {
            ...category,
            name,
            slug: nextSlug,
            description: payload.description.trim() || category.description,
            sortOrder,
          }
        : category,
    );
    writeDemoCategories(nextCategories);
    return nextCategories.find((category) => category.id === editingId);
  }

  const newCategory = {
    id: `cat-demo-${crypto.randomUUID()}`,
    name,
    slug: nextSlug,
    description: payload.description.trim() || "Custom category created from admin demo.",
    imageTone: CATEGORY_TONES[categoryList.length % CATEGORY_TONES.length],
    isActive: true,
    sortOrder,
  };

  const nextCategories = [...categoryList, newCategory];
  writeDemoCategories(nextCategories);
  return newCategory;
}

export function archiveDemoCategory(categoryId) {
  const nextCategories = readDemoCategories().map((category) =>
    category.id === categoryId ? { ...category, isActive: false } : category,
  );
  writeDemoCategories(nextCategories);
  return sortCategories(nextCategories);
}

export function restoreDemoCategory(categoryId) {
  const nextCategories = readDemoCategories().map((category) =>
    category.id === categoryId ? { ...category, isActive: true } : category,
  );
  writeDemoCategories(nextCategories);
  return sortCategories(nextCategories);
}
