import { Heart, PackageCheck, Ruler, ShieldCheck, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import ProductImageGallery from "../../components/product/ProductImageGallery.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { getProductBySlug } from "../../services/productService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const detailHighlights = [
  { label: "Premium material", icon: ShieldCheck },
  { label: "Variant stock visible", icon: PackageCheck },
  { label: "Shipping estimate ready", icon: Truck },
  { label: "Size and care details", icon: Ruler },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { addItem } = useCart();
  const { products: relatedProducts } = useProducts({ category: product?.category?.slug ?? "" });

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      const result = await getProductBySlug(slug);
      if (!active) return;
      setProduct(result);
      setSelectedVariant(result?.variants?.find((variant) => variant.stock > 0) ?? result?.variants?.[0] ?? null);
      setLoading(false);
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="section-shell py-20 text-sm font-bold text-muted">Loading product...</div>;
  }

  if (!product) {
    return (
      <section className="section-shell py-20">
        <EmptyState
          title="Produk tidak ditemukan"
          description="Produk mungkin sudah tidak aktif atau slug berubah."
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </section>
    );
  }

  const stockStatus =
    selectedVariant?.stock === 0
      ? "Out of Stock"
      : selectedVariant?.stock <= 5
        ? "Low Stock"
        : "In Stock";
  const stockTone =
    stockStatus === "Out of Stock" ? "warning" : stockStatus === "Low Stock" ? "warning" : "success";

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const result = addItem(product, selectedVariant, quantity);
    setMessage(result.ok ? "Produk berhasil ditambahkan ke cart." : result.message);
  };

  const related = relatedProducts.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <ProductImageGallery
          product={product}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
        />

        <div className="rounded-[2.5rem] border border-linen bg-white p-5 shadow-card sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.badges.map((badge) => (
              <Badge key={badge} tone={badge === "Sale" ? "sale" : badge === "Premium" ? "premium" : "default"}>
                {badge}
              </Badge>
            ))}
            <Badge tone={stockTone}>{stockStatus}</Badge>
          </div>
          <p className="text-sm font-bold text-clay">{product.category?.name}</p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-[#D89C3A]">
              <Star size={18} fill="currentColor" />
              <span className="font-bold text-ink">{product.rating}</span>
              <span className="text-sm text-muted">({product.sold} sold)</span>
            </div>
            <p className="text-sm font-bold text-muted">SKU: {product.sku}</p>
          </div>
          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-4xl font-bold text-clay">
              {formatCurrency(product.effectivePrice)}
            </p>
            {product.salePrice && (
              <p className="mb-1 text-sm font-bold text-muted line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>
          <p className="mt-5 text-sm leading-8 text-muted">{product.description}</p>

          <div className="mt-7">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-muted">
              Color Variant
            </p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={`${variant.colorName}-${variant.size}`}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition ${
                    selectedVariant?.colorName === variant.colorName
                      ? "border-clay bg-clay text-white"
                      : "border-linen bg-ivory text-muted hover:border-clay hover:text-clay"
                  } ${variant.stock === 0 ? "opacity-50" : ""}`}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                >
                  <span className="h-5 w-5 rounded-full border border-white/70" style={{ backgroundColor: variant.colorHex }} />
                  {variant.colorName}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className="mt-3 text-sm font-semibold text-muted">
                {selectedVariant.size} - {selectedVariant.stock} stock available
              </p>
            )}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-[150px_1fr]">
            <label>
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-muted">
                Quantity
              </span>
              <input
                className="input-field"
                min="1"
                max={selectedVariant?.stock ?? 1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                type="number"
              />
            </label>
            <div className="flex items-end gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                Add to Cart
              </Button>
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full border border-linen bg-ivory text-clay"
                type="button"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {detailHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-ivory p-4">
                  <Icon className="text-clay" size={20} />
                  <span className="text-sm font-bold text-ink">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {[
          ["Material", product.material],
          ["Care Instruction", product.careInstruction],
          ["Style Recommendation", "Daily wear, work outfit, campus look, and formal neutral styling."],
        ].map(([title, value]) => (
          <div key={title} className="rounded-[2rem] border border-linen bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{value}</p>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeader
            eyebrow="Related Products"
            title="More shades from this category."
            actionLabel="Back to Shop"
            actionTo="/shop"
          />
          <ProductGrid products={related} onQuickAdd={(item) => addItem(item, item.variants[0], 1)} />
        </div>
      )}
    </section>
  );
}
