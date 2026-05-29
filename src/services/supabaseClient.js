import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const forceDemoMode = import.meta.env.VITE_FORCE_DEMO_MODE === "true";

const hasRealSupabaseUrl = Boolean(
  supabaseUrl && supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co"),
);
const hasRealSupabaseAnonKey = Boolean(
  supabaseAnonKey && !["your-anon-key", "your_supabase_anon_key"].includes(supabaseAnonKey),
);

export const isSupabaseConfigured = !forceDemoMode && hasRealSupabaseUrl && hasRealSupabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
