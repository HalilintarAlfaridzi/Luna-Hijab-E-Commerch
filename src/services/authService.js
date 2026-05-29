import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

async function buildSessionUser(authUser) {
  const [{ data: userRow }, { data: profileRow }] = await Promise.all([
    supabase.from("users").select("role, email, is_active").eq("id", authUser.id).single(),
    supabase.from("profiles").select("full_name, phone, avatar_url, birth_date").eq("user_id", authUser.id).single(),
  ]);

  return {
    id: authUser.id,
    email: userRow?.email ?? authUser.email,
    role: userRow?.role ?? "customer",
    isActive: userRow?.is_active ?? true,
    fullName: profileRow?.full_name ?? authUser.user_metadata?.full_name ?? "Customer",
    phone: profileRow?.phone ?? "",
    avatarUrl: profileRow?.avatar_url ?? "",
    birthDate: profileRow?.birth_date ?? "",
  };
}

export async function signInWithEmail(email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return buildSessionUser(data.user);
  }

  const role = email.toLowerCase().includes("admin") ? "admin" : "customer";
  return {
    id: role === "admin" ? "demo-admin" : "demo-customer",
    email,
    role,
    fullName: role === "admin" ? "Admin Luna" : "Customer Demo",
    phone: "",
    birthDate: "",
  };
}

export async function signUpWithEmail({ email, password, fullName }) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return buildSessionUser(data.user);
  }

  return {
    id: "registered-customer",
    email,
    role: "customer",
    fullName,
    phone: "",
    birthDate: "",
  };
}

export async function updateUserProfile(user, payload) {
  const nextProfile = {
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    birthDate: payload.birthDate,
  };

  if (!isSupabaseConfigured) {
    return {
      ...user,
      ...nextProfile,
    };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { full_name: nextProfile.fullName },
  });

  if (metadataError) throw metadataError;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: nextProfile.fullName,
      phone: nextProfile.phone,
      birth_date: nextProfile.birthDate || null,
    },
    { onConflict: "user_id" },
  );

  if (profileError) throw profileError;

  return {
    ...user,
    ...nextProfile,
  };
}
