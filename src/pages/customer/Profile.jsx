import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      birthDate: user?.birthDate ?? "",
    });
  }, [user]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.fullName.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        birthDate: form.birthDate,
      });
      setMessage("Profile berhasil diperbarui.");
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Profile</h2>
      <p className="mt-2 text-sm leading-7 text-muted">
        Form demo untuk data profile. Pada Supabase, data detail masuk ke tabel profiles.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
        />
        <Input
          label="Email"
          value={form.email}
          type="email"
          readOnly
        />
        <Input
          label="Phone"
          placeholder="+62 812..."
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          label="Birth date"
          type="date"
          value={form.birthDate}
          onChange={(event) => updateField("birthDate", event.target.value)}
        />
      </div>
      {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
      {message && <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button className="w-full sm:w-auto" type="submit">{saving ? "Saving..." : "Update Profile"}</Button>
        <Button variant="secondary" type="button" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </form>
  );
}
