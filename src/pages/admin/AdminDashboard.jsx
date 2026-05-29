import { AlertTriangle, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import OrderTable from "../../components/admin/OrderTable.jsx";
import ProductTable from "../../components/admin/ProductTable.jsx";
import StatsCard from "../../components/admin/StatsCard.jsx";
import { revenueData } from "../../data/mockData.js";
import { useProducts } from "../../hooks/useProducts.js";
import { getAdminOrders } from "../../services/orderService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export default function AdminDashboard() {
  const { products } = useProducts({ sort: "best-sellers" });
  const [orders, setOrders] = useState([]);
  const lowStock = products.filter((product) => product.activeStock <= 8);
  const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));
  const pendingOrders = orders.filter((order) => order.status === "pending_payment").length;

  useEffect(() => {
    getAdminOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Revenue" value={formatCurrency(14900000)} helper="+18% this month" icon={Wallet} />
        <StatsCard label="Orders" value={String(orders.length)} helper={`${pendingOrders} pending`} icon={ShoppingBag} />
        <StatsCard label="Customers" value="642" helper="+41 new" icon={Users} />
        <StatsCard label="Products" value={String(products.length)} helper={`${lowStock.length} low stock`} icon={Package} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="admin-card">
          <h2 className="mb-4 font-display text-3xl font-bold text-ink">Revenue Trend</h2>
          <div className="flex h-80 items-end gap-4 rounded-[1.5rem] bg-ivory p-5">
            {revenueData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end rounded-full bg-white/70 p-1">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-clay to-sand shadow-card"
                    style={{ height: `${Math.max(18, (item.revenue / maxRevenue) * 100)}%` }}
                    title={formatCurrency(item.revenue)}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">{item.month}</p>
                  <p className="mt-1 text-xs font-bold text-clay">{item.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D89C3A]/10 text-[#D89C3A]">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Low Stock</h2>
              <p className="text-sm text-muted">Variant-level alert preview</p>
            </div>
          </div>
          <div className="grid gap-3">
            {lowStock.slice(0, 5).map((product) => (
              <div key={product.id} className="rounded-2xl bg-ivory p-4">
                <p className="font-bold text-ink">{product.name}</p>
                <p className="text-sm text-muted">{product.activeStock} pcs available</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="admin-card">
          <h2 className="mb-4 font-display text-3xl font-bold text-ink">Top Products</h2>
          <ProductTable products={products.slice(0, 4)} />
        </div>
        <div className="admin-card">
          <h2 className="mb-4 font-display text-3xl font-bold text-ink">Recent Orders</h2>
          <OrderTable orders={orders.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
