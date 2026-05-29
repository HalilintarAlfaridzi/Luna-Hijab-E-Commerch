import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Button from "../common/Button.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function navClass({ isActive }) {
  return `text-sm font-bold transition hover:text-clay ${
    isActive ? "text-clay" : "text-muted"
  }`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totals } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-ivory/85 backdrop-blur-xl">
      <div className="bg-ink px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-white">
        Free shipping for orders over Rp250.000
      </div>
      <nav className="section-shell flex h-20 items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay font-display text-xl font-bold text-white">
            L
          </span>
          <span>
            <span className="block font-display text-2xl font-bold leading-none text-ink">Luna</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-clay">
              Hijab Studio
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button to="/shop" variant="ghost" size="sm" aria-label="Search products">
            <Search size={18} />
          </Button>
          <Button to="/account/wishlist" variant="ghost" size="sm" aria-label="Wishlist">
            <Heart size={18} />
          </Button>
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-clay"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {totals.count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-extrabold text-white">
                {totals.count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="group relative">
              <Button to={user.role === "admin" ? "/admin/dashboard" : "/account"} variant="secondary" size="sm">
                <User size={16} />
                {user.role === "admin" ? "Admin" : "Account"}
              </Button>
              <button
                className="absolute right-0 top-12 hidden rounded-2xl border border-linen bg-white px-4 py-2 text-sm font-bold text-muted shadow-card group-hover:block"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Button to="/login" size="sm">
              Login
            </Button>
          )}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card lg:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="section-shell pb-5 lg:hidden">
          <div className="rounded-[1.5rem] border border-linen bg-white p-4 shadow-card">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-bold ${
                      isActive ? "bg-clay text-white" : "bg-ivory text-muted"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button to="/cart" variant="secondary" onClick={() => setOpen(false)}>
                Cart ({totals.count})
              </Button>
              <Button to={user ? "/account" : "/login"} onClick={() => setOpen(false)}>
                {user ? "Account" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
