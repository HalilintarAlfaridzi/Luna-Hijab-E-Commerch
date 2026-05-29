import { useEffect, useState } from "react";
import OrderTable from "../../components/admin/OrderTable.jsx";
import Button from "../../components/common/Button.jsx";
import {
  acceptPayment,
  exportDemoOrdersCsv,
  getAdminOrders,
  updateOrderStatus,
} from "../../services/orderService.js";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setOrders(await getAdminOrders());
    } catch (caughtError) {
      setMessage(caughtError.message);
    }
  }

  const handleAcceptPayment = async (orderId) => {
    try {
      setOrders(await acceptPayment(orderId));
      setMessage(`${orderId} accepted. Payment marked as paid.`);
    } catch (caughtError) {
      setMessage(caughtError.message);
    }
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setOrders(await updateOrderStatus(orderId, nextStatus));
      setMessage(`${orderId} status updated to ${nextStatus}.`);
    } catch (caughtError) {
      setMessage(caughtError.message);
    }
  };

  const handleExportCsv = () => {
    const csv = exportDemoOrdersCsv(orders);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "luna-hijab-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Orders exported to CSV.");
  };

  return (
    <div className="grid gap-6">
      <div className="admin-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow mb-2">Orders</p>
            <h2 className="font-display text-4xl font-bold text-ink">Order Management</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Status flow: pending_payment to paid to processing to packed to shipped to completed.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </div>
        {message && <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>}
      </div>
      <OrderTable
        orders={orders}
        onAcceptPayment={handleAcceptPayment}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
