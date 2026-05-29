import EmptyState from "../common/EmptyState.jsx";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onQuickAdd }) {
  if (!products.length) {
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        description="Coba ubah kata kunci, kategori, atau urutan produk."
        actionLabel="Reset ke Shop"
        actionTo="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}
