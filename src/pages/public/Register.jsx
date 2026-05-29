import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/account", { replace: true });
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <section className="section-shell grid min-h-[calc(100vh-12rem)] items-center py-10">
      <form className="mx-auto w-full max-w-lg rounded-[2rem] border border-linen bg-white p-6 shadow-card sm:p-8" onSubmit={handleSubmit}>
        <p className="eyebrow mb-4">Register</p>
        <h1 className="font-display text-4xl font-bold text-ink">Create customer account.</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Demo register membuat customer session lokal. Supabase Auth bisa langsung dipakai ketika env sudah diisi.
        </p>
        <div className="mt-6 grid gap-4">
          <Input
            label="Full name"
            value={form.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            required
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            type="email"
            required
          />
          <Input
            label="Password"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            type="password"
            minLength={6}
            required
          />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
        <Button className="mt-6 w-full" size="lg" type="submit">
          Register
        </Button>
        <p className="mt-5 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link className="font-bold text-clay" to="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
