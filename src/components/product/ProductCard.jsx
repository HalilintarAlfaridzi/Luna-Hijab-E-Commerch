import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency.js";
import Badge from "../common/Badge.jsx";
import ProductVisual from "./ProductVisual.jsx";

function badgeTone(label) {
  if (label === "Sale") return "sale";
  if (label === "Premium") return "premium";
  if (label === "New") return "success";
  return "default";
}

export default function ProductCard({ product, onQuickAdd }) {
  const hasSale = Boolean(product.salePrice);

  return (
    <article className="group rounded-[2rem] border border-linen bg-white p-3 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative">
          <ProductVisual product={product} compact className="aspect-[4/5]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge} tone={badgeTone(badge)}>
                {badge}
              </Badge>
            ))}
          </div>
          <button
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-clay shadow-card transition hover:bg-clay hover:text-white"
            type="button"
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
        </div>
      </Link>

      <div className="px-2 pb-2 pt-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-bold text-muted">
          <span>{product.category?.name}</span>
          <span className="inline-flex items-center gap-1 text-clay">
            <Star size={14} fill="currentColor" />
            {product.rating}
          </span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-xl font-bold leading-tight text-ink transition group-hover:text-clay">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-extrabold text-ink">{formatCurrency(product.effectivePrice)}</p>
            {hasSale && (
              <p className="text-xs font-semibold text-muted line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition hover:bg-clay"
            type="button"
            onClick={() => onQuickAdd?.(product)}
            aria-label="Quick add"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
