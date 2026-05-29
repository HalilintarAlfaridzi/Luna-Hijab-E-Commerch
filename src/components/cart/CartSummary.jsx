import { formatCurrency } from "../../utils/formatCurrency.js";
import Button from "../common/Button.jsx";

export default function CartSummary({ totals, checkoutTo = "/checkout", checkoutLabel = "Checkout" }) {
  const rows = [
    ["Subtotal", totals.subtotal],
    ["Shipping estimate", totals.shipping],
    ["Discount", -totals.discount],
  ];

  return (
    <aside className="rounded-[2rem] border border-linen bg-white p-5 shadow-card lg:sticky lg:top-24">
      <h2 className="font-display text-2xl font-bold text-ink">Order Summary</h2>
      <div className="mt-5 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-sm text-muted">
            <span>{label}</span>
            <span className="font-bold text-ink">{formatCurrency(value)}</span>
          </div>
        ))}
      </div>
      <div className="my-5 h-px bg-linen" />
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink">Total</span>
        <span className="font-display text-2xl font-bold text-clay">{formatCurrency(totals.total)}</span>
      </div>
      {totals.discount > 0 && (
        <p className="mt-3 rounded-2xl bg-sage/10 p-3 text-xs font-semibold leading-5 text-sage">
          Promo otomatis: hemat Rp25.000 untuk belanja minimal Rp300.000.
        </p>
      )}
      <Button to={checkoutTo} className="mt-6 w-full" size="lg">
        {checkoutLabel}
      </Button>
    </aside>
  );
}
