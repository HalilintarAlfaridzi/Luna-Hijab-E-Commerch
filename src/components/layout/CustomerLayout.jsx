import { Heart, Home, MapPin, Package, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import PublicLayout from "./PublicLayout.jsx";

const links = [
  { label: "Overview", to: "/account", icon: Home },
  { label: "Profile", to: "/account/profile", icon: User },
  { label: "Orders", to: "/account/orders", icon: Package },
  { label: "Wishlist", to: "/account/wishlist", icon: Heart },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
];

export default function CustomerLayout() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

export function CustomerShell() {
  return (
    <section className="section-shell py-10">
      <div className="mb-8">
        <p className="eyebrow mb-3">Customer Area</p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">My Account</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-linen bg-white p-3 shadow-card lg:self-start">
          <nav className="grid gap-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/account"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                      isActive ? "bg-clay text-white" : "text-muted hover:bg-ivory hover:text-clay"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
