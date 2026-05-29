import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency.js";
import ProductVisual from "../product/ProductVisual.jsx";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-4 rounded-[1.5rem] border border-linen bg-white p-3 shadow-card sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <ProductVisual product={item.product} compact className="aspect-square rounded-[1.25rem]" />
      <div>
        <h3 className="font-display text-xl font-bold text-ink">{item.product.name}</h3>
        <p className="mt-1 text-sm text-muted">
          {item.variant.colorName} / {item.variant.size}
        </p>
        <p className="mt-2 text-sm font-extrabold text-clay">{formatCurrency(item.priceSnapshot)}</p>
        <div className="mt-3 flex w-fit items-center rounded-full border border-linen bg-ivory p-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <button
        className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[#C75146]/10 px-4 py-3 text-sm font-bold text-[#C75146] transition hover:bg-[#C75146] hover:text-white sm:col-span-1"
        type="button"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 size={16} />
        Remove
      </button>
    </div>
  );
}
