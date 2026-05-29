import { LogOut, Store } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-ivory lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-linen bg-ivory/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-clay">Admin Demo</p>
              <h1 className="font-display text-2xl font-bold text-ink">Store Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex h-11 items-center gap-2 rounded-full border border-linen bg-white px-4 text-sm font-bold text-ink transition hover:text-clay"
              >
                <Store size={16} />
                Storefront
              </Link>
              <button
                className="flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-clay"
                type="button"
                onClick={logout}
              >
                <LogOut size={16} />
                {user?.fullName ?? "Logout"}
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
