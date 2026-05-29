import ProductGrid from "../../components/product/ProductGrid.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";

export default function CollectionPage({ title, eyebrow, description, filter }) {
  const { products, loading } = useProducts(filter);
  const { addItem } = useCart();

  const quickAdd = (product) => {
    const variant = product.variants.find((item) => item.stock > 0) ?? product.variants[0];
    addItem(product, variant, 1);
  };

  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="mb-8 rounded-[2.5rem] bg-linen-radial p-6 shadow-card sm:p-10">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p>
      </div>
      {loading ? (
        <div className="rounded-[2rem] border border-linen bg-white p-10 text-sm font-bold text-muted">
          Loading collection...
        </div>
      ) : (
        <ProductGrid products={products} onQuickAdd={quickAdd} />
      )}
    </section>
  );
}
