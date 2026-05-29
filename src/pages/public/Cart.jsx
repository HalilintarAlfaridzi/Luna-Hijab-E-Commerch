import CartItem from "../../components/cart/CartItem.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function Cart() {
  const { items, totals, updateQuantity, removeItem } = useCart();

  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="eyebrow mb-3">Cart</p>
        <h1 className="font-display text-5xl font-bold text-ink sm:text-6xl">Review your order.</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Cart masih kosong"
          description="Pilih produk dan varian warna terlebih dahulu sebelum checkout."
          actionLabel="Shop Collection"
          actionTo="/shop"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <CartSummary totals={totals} />
        </div>
      )}
    </section>
  );
}
