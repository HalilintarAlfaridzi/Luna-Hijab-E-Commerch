import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadProductImage(file, productId) {
  if (!file) return null;
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }

  const path = `products/${productId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
