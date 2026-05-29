import { Heart, MapPin, Package, User } from "lucide-react";
import { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard.jsx";
import OrderTable from "../../components/admin/OrderTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getCustomerOrders } from "../../services/orderService.js";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getCustomerOrders(user?.id).then(setOrders).catch(() => setOrders([]));
  }, [user?.id]);

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-linen-radial p-6 shadow-card">
        <p className="eyebrow mb-3">Welcome</p>
        <h2 className="font-display text-4xl font-bold text-ink">
          Hello, {user?.fullName ?? "Customer"}.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          Dashboard customer menampilkan ringkasan order, wishlist, profile, dan alamat.
          Pada versi Supabase data akan difilter dengan auth.uid().
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Orders" value={String(orders.length)} helper={`${paidOrders} paid orders`} icon={Package} />
        <StatsCard label="Wishlist" value="4" helper="Saved products" icon={Heart} />
        <StatsCard label="Addresses" value="2" helper="1 default" icon={MapPin} />
        <StatsCard label="Profile" value="80%" helper="Complete data" icon={User} />
      </div>
      <div className="admin-card">
        <h3 className="mb-4 font-display text-3xl font-bold text-ink">Recent Orders</h3>
        <OrderTable orders={orders.slice(0, 2)} />
      </div>
    </div>
  );
}
