import ProductGrid from "../../components/product/ProductGrid.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";

export default function Wishlist() {
  const { products } = useProducts({ featured: true });
  const { addItem } = useCart();

  return (
    <div className="grid gap-6">
      <div className="admin-card">
        <h2 className="font-display text-3xl font-bold text-ink">Wishlist</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Wishlist demo memakai featured products. Versi production disimpan di tabel wishlists agar sync lintas device.
        </p>
      </div>
      <ProductGrid
        products={products.slice(0, 4)}
        onQuickAdd={(product) => addItem(product, product.variants.find((variant) => variant.stock > 0) ?? product.variants[0], 1)}
      />
    </div>
  );
}
