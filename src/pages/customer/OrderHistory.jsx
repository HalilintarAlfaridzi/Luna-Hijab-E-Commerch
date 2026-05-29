import { useEffect, useState } from "react";
import OrderTable from "../../components/admin/OrderTable.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getCustomerOrders } from "../../services/orderService.js";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getCustomerOrders(user?.id).then(setOrders).catch(() => setOrders([]));
  }, [user?.id]);

  return (
    <div className="grid gap-6">
      <div className="admin-card">
        <h2 className="font-display text-3xl font-bold text-ink">Order History</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Customer hanya boleh melihat order miliknya sendiri melalui policy user_id = auth.uid().
        </p>
      </div>
      {orders.length > 0 ? (
        <OrderTable orders={orders} />
      ) : (
        <EmptyState
          title="Belum ada order"
          description="Akun ini belum pernah checkout. Order akun lain tidak ditampilkan."
          actionLabel="Shop Collection"
          actionTo="/shop"
        />
      )}
    </div>
  );
}
