import { formatCurrency } from "../../utils/formatCurrency.js";
import Badge from "../common/Badge.jsx";

export default function ProductTable({ products, onEdit, onArchive }) {
  const showActions = Boolean(onEdit || onArchive);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-linen bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              {showActions && <th className="px-5 py-4">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-linen">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">{product.name}</p>
                  <p className="text-xs text-muted">{product.sku}</p>
                </td>
                <td className="px-5 py-4 text-muted">{product.category?.name}</td>
                <td className="px-5 py-4 font-bold text-ink">
                  {formatCurrency(product.effectivePrice)}
                </td>
                <td className="px-5 py-4 text-muted">{product.activeStock} pcs</td>
                <td className="px-5 py-4">
                  <Badge tone={product.isDraft || product.isActive === false || product.activeStock < 8 ? "warning" : "success"}>
                    {product.isDraft
                      ? "Draft"
                      : product.isActive === false
                        ? "Archived"
                        : product.activeStock < 8
                          ? "Low Stock"
                          : "Active"}
                  </Badge>
                </td>
                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          className="rounded-full border border-clay px-3 py-2 text-xs font-bold text-clay transition hover:bg-clay hover:text-white"
                          type="button"
                          onClick={() => onEdit(product)}
                        >
                          Edit
                        </button>
                      )}
                      {onArchive && product.isActive !== false && (
                        <button
                          className="rounded-full bg-[#C75146]/10 px-3 py-2 text-xs font-bold text-[#C75146] transition hover:bg-[#C75146] hover:text-white"
                          type="button"
                          onClick={() => onArchive(product)}
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
