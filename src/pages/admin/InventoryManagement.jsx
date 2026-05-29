import { useMemo, useState } from "react";
import Badge from "../../components/common/Badge.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { updateInventoryStock } from "../../services/productService.js";
import { isSupabaseConfigured } from "../../services/supabaseClient.js";

export default function InventoryManagement() {
  const { products } = useProducts({ sort: "latest" });
  const [stockDrafts, setStockDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const rows = useMemo(() => products.flatMap((product) =>
    product.variants.map((variant) => ({
      id: `${product.id}-${variant.colorName}`,
      variantId: variant.id,
      product: product.name,
      color: variant.colorName,
      size: variant.size,
      stock: variant.stock,
    })),
  ), [products]);

  const handleSaveStock = async (row) => {
    const nextStock = stockDrafts[row.variantId] ?? row.stock;

    try {
      setError("");
      await updateInventoryStock(row.variantId, nextStock);
      setMessage(
        isSupabaseConfigured
          ? `${row.product} - ${row.color} stock updated to ${nextStock}.`
          : "Inventory update needs Supabase configuration.",
      );
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="font-display text-4xl font-bold text-ink">Inventory Management</h2>
      <p className="mt-2 text-sm leading-7 text-muted">
        Stok dikelola per varian warna/ukuran, bukan hanya per produk.
      </p>
      {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
      {message && <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>}
      <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-linen">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Color</th>
              <th className="px-5 py-4">Size</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen bg-white">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-4 font-bold text-ink">{row.product}</td>
                <td className="px-5 py-4 text-muted">{row.color}</td>
                <td className="px-5 py-4 text-muted">{row.size}</td>
                <td className="px-5 py-4">
                  <input
                    className="w-28 rounded-full border border-linen px-3 py-2 text-sm font-bold text-ink outline-none focus:border-clay"
                    min="0"
                    type="number"
                    value={stockDrafts[row.variantId] ?? row.stock}
                    onChange={(event) =>
                      setStockDrafts((current) => ({
                        ...current,
                        [row.variantId]: event.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-5 py-4">
                  <Badge tone={row.stock === 0 ? "warning" : row.stock <= 5 ? "warning" : "success"}>
                    {row.stock === 0 ? "Out" : row.stock <= 5 ? "Low" : "Ready"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <button
                    className="rounded-full bg-clay px-4 py-2 text-xs font-bold text-white transition hover:bg-espresso"
                    type="button"
                    onClick={() => handleSaveStock(row)}
                  >
                    Save Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
