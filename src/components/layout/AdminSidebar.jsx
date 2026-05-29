import {
  BarChart3,
  Boxes,
  Image,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Inventory", to: "/admin/inventory", icon: Boxes },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Reviews", to: "/admin/reviews", icon: MessageSquare },
  { label: "Banners", to: "/admin/banners", icon: Image },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  return (
    <aside className="border-r border-linen bg-white px-4 py-6 lg:min-h-screen lg:w-72">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-white">
          L
        </span>
        <div>
          <p className="font-display text-2xl font-bold leading-none text-ink">Luna Admin</p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-clay">Backoffice</p>
        </div>
      </div>
      <nav className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
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
  );
}
