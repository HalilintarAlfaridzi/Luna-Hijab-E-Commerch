import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { createOrder } from "../../services/orderService.js";
import { PAYMENT_METHODS } from "../../utils/constants.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [error, setError] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: user?.fullName ?? "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    fullAddress: "",
    notes: "",
  });

  if (!user) return <Navigate to="/login" replace state={{ from: "/checkout" }} />;

  if (items.length === 0) {
    return (
      <section className="section-shell py-20">
        <EmptyState
          title="Tidak ada item untuk checkout"
          description="Cart kosong, jadi order belum bisa dibuat."
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </section>
    );
  }

  const updateField = (key, value) => setShipping((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setCreatingOrder(true);
      const order = await createOrder({ cartItems: items, shipping, paymentMethod, totals, user });
      localStorage.setItem("luna-hijab-last-order", JSON.stringify(order));
      clearCart();
      navigate(`/order-success/${order.orderNumber}`);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="eyebrow mb-3">Checkout</p>
        <h1 className="font-display text-5xl font-bold text-ink sm:text-6xl">Shipping and payment.</h1>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr_380px]" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-linen bg-white p-5 shadow-card sm:p-8">
            <h2 className="font-display text-3xl font-bold text-ink">Shipping Form</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                value={shipping.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                required
              />
              <Input
                label="Phone"
                value={shipping.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
              />
              <Input
                label="Province"
                value={shipping.province}
                onChange={(event) => updateField("province", event.target.value)}
                required
              />
              <Input
                label="City"
                value={shipping.city}
                onChange={(event) => updateField("city", event.target.value)}
                required
              />
              <Input
                label="District"
                value={shipping.district}
                onChange={(event) => updateField("district", event.target.value)}
              />
              <Input
                label="Postal code"
                value={shipping.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
              />
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-ink">Full address</span>
              <textarea
                className="input-field min-h-28 resize-none"
                value={shipping.fullAddress}
                onChange={(event) => updateField("fullAddress", event.target.value)}
                required
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-ink">Order notes</span>
              <textarea
                className="input-field min-h-24 resize-none"
                placeholder="Tolong dikirim sore hari."
                value={shipping.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </label>
          </div>

          <div className="rounded-[2rem] border border-linen bg-white p-5 shadow-card sm:p-8">
            <h2 className="font-display text-3xl font-bold text-ink">Payment Method</h2>
            <div className="mt-5 grid gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 text-sm font-bold ${
                    paymentMethod === method.value
                      ? "border-clay bg-clay text-white"
                      : "border-linen bg-ivory text-ink"
                  }`}
                >
                  <span>{method.label}</span>
                  <input
                    checked={paymentMethod === method.value}
                    className="sr-only"
                    name="paymentMethod"
                    type="radio"
                    onChange={() => setPaymentMethod(method.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-linen bg-white p-5 shadow-card lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-3xl font-bold text-ink">Order Summary</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-bold text-ink">{item.product.name}</p>
                  <p className="text-muted">
                    {item.quantity} x {item.variant.colorName}
                  </p>
                </div>
                <p className="font-bold text-ink">{formatCurrency(item.priceSnapshot * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="my-5 h-px bg-linen" />
          {[
            ["Subtotal", totals.subtotal],
            ["Shipping", totals.shipping],
            ["Discount", -totals.discount],
          ].map(([label, value]) => (
            <div key={label} className="mb-3 flex justify-between text-sm text-muted">
              <span>{label}</span>
              <span className="font-bold text-ink">{formatCurrency(value)}</span>
            </div>
          ))}
          <div className="mt-5 flex justify-between">
            <span className="font-bold text-ink">Total</span>
            <span className="font-display text-2xl font-bold text-clay">{formatCurrency(totals.total)}</span>
          </div>
          <Button className="mt-6 w-full" size="lg" type="submit">
            {creatingOrder ? "Creating Order..." : "Create Order"}
          </Button>
          {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
          <p className="mt-4 text-xs leading-5 text-muted">
            Demo order akan dibuat dengan status awal pending_payment dan payment_status unpaid.
          </p>
        </aside>
      </form>
    </section>
  );
}
