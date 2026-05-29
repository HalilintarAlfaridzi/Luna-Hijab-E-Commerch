import { CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

const timeline = ["Order Created", "Payment Pending", "Processing", "Packed", "Shipped", "Completed"];

export default function OrderSuccess() {
  const { orderId } = useParams();
  const order = useMemo(() => {
    const stored = localStorage.getItem("luna-hijab-last-order");
    return stored ? JSON.parse(stored) : null;
  }, []);

  return (
    <section className="section-shell py-14">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-linen bg-white p-6 text-center shadow-soft sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage text-white">
          <CheckCircle2 size={32} />
        </div>
        <p className="eyebrow mb-4">Order Created</p>
        <h1 className="font-display text-5xl font-bold text-ink">Thank you for your order.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Order demo sudah dibuat. Pada versi Supabase, langkah ini akan insert ke orders,
          order_items, mengurangi inventory, dan mengubah cart menjadi converted.
        </p>

        <div className="mt-8 rounded-[2rem] bg-ivory p-5 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Order ID</p>
              <p className="mt-2 font-bold text-ink">{order?.orderNumber ?? orderId}</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Total</p>
              <p className="mt-2 font-bold text-ink">{formatCurrency(order?.total ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Status</p>
              <p className="mt-2 font-bold text-clay">pending_payment</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Payment</p>
              <p className="mt-2 font-bold text-ink">{order?.paymentMethod ?? "bank_transfer"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 text-left">
          {timeline.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-linen">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  index <= 1 ? "bg-clay text-white" : "bg-ivory text-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-bold text-ink">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/account/orders">View Order History</Button>
          <Button to="/shop" variant="secondary">Continue Shopping</Button>
        </div>
      </div>
    </section>
  );
}
