import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "customer@demo.com", password: "customer123" });
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      const fallback = user.role === "admin" ? "/admin/dashboard" : "/account";
      navigate(location.state?.from ?? fallback, { replace: true });
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <section className="section-shell grid min-h-[calc(100vh-12rem)] items-center py-10 lg:grid-cols-[.9fr_1.1fr]">
      <div className="hidden rounded-[2.5rem] bg-linen-radial p-8 shadow-soft lg:block">
        <div className="rounded-[2rem] border border-white/60 bg-white/40 p-10">
          <p className="eyebrow mb-4">Demo Accounts</p>
          <h1 className="font-display text-5xl font-bold leading-tight text-ink">Role-based login flow.</h1>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="font-bold text-ink">Customer Demo</p>
              <p className="text-muted">customer@demo.com / customer123</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="font-bold text-ink">Admin Demo</p>
              <p className="text-muted">admin@demo.com / admin123</p>
            </div>
          </div>
        </div>
      </div>

      <form className="mx-auto w-full max-w-md rounded-[2rem] border border-linen bg-white p-6 shadow-card sm:p-8" onSubmit={handleSubmit}>
        <p className="eyebrow mb-4">Login</p>
        <h1 className="font-display text-4xl font-bold text-ink">Welcome back.</h1>
        <div className="mt-6 grid gap-4">
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
            required
          />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
        <Button className="mt-6 w-full" size="lg" type="submit">
          Login
        </Button>
        <p className="mt-5 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link className="font-bold text-clay" to="/register">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
