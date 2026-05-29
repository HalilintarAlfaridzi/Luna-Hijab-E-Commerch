import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import ProductTable from "../../components/admin/ProductTable.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import {
  archiveAdminProduct,
  getAdminProducts,
  saveAdminProduct,
} from "../../services/productService.js";
import { isSupabaseConfigured } from "../../services/supabaseClient.js";

const initialForm = {
  name: "",
  sku: "",
  categoryId: "",
  price: "",
  material: "",
  colorName: "",
  size: "180 x 75 cm",
  stock: "0",
  shortDescription: "",
  imageFile: null,
};

export default function ProductManagement() {
  const formRef = useRef(null);
  const { products, categories } = useProducts({ sort: "latest" });
  const [adminProducts, setAdminProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminProducts();
  }, []);

  useEffect(() => {
    if (!form.categoryId && categories[0]?.id) {
      setForm((current) => ({ ...current, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const tableProducts = useMemo(
    () => (adminProducts.length ? adminProducts : products),
    [adminProducts, products],
  );

  async function loadAdminProducts() {
    try {
      setAdminProducts(await getAdminProducts());
    } catch (caughtError) {
      setError(caughtError.message);
    }
  }

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAddProduct = () => {
    setForm({ ...initialForm, categoryId: categories[0]?.id ?? "" });
    setEditingProduct(null);
    setError("");
    setMessage("Form produk baru siap diisi.");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEditProduct = (product) => {
    const firstVariant = product.variants?.[0];
    setEditingProduct(product);
    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      categoryId: product.categoryId ?? product.category?.id ?? categories[0]?.id ?? "",
      price: String(product.price ?? ""),
      material: product.material ?? "",
      colorName: firstVariant?.colorName ?? "",
      size: firstVariant?.size ?? "180 x 75 cm",
      stock: String(firstVariant?.stock ?? product.activeStock ?? 0),
      shortDescription: product.shortDescription ?? "",
      imageFile: null,
    });
    setError("");
    setMessage(`Editing ${product.name}.`);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleArchiveProduct = async (product) => {
    try {
      setError("");
      await archiveAdminProduct(product.id);
      await loadAdminProducts();
      setMessage(`${product.name} berhasil diarsipkan.`);
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Harga produk harus lebih dari 0.");
      return;
    }

    try {
      setSaving(true);
      const savedProduct = await saveAdminProduct(form, editingProduct);
      await loadAdminProducts();
      setForm({ ...initialForm, categoryId: categories[0]?.id ?? "" });
      setEditingProduct(null);
      setMessage(
        isSupabaseConfigured
          ? `${savedProduct.name} berhasil disimpan ke Supabase.`
          : `${savedProduct.name} berhasil disimpan sebagai draft demo.`,
      );
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="admin-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow mb-2">Products</p>
            <h2 className="font-display text-4xl font-bold text-ink">Product Management</h2>
          </div>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form ref={formRef} className="admin-card" onSubmit={handleSaveProduct}>
          <h3 className="font-display text-3xl font-bold text-ink">
            {editingProduct ? "Edit Product" : "Quick Product Form"}
          </h3>
          <div className="mt-5 grid gap-4">
            <Input
              label="Product name"
              placeholder="Luna Soft Pashmina"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
            />
            <Input
              label="SKU"
              placeholder="LH-PSM-009"
              value={form.sku}
              onChange={(event) => updateForm("sku", event.target.value)}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">Category</span>
              <select
                className="input-field"
                value={form.categoryId}
                onChange={(event) => updateForm("categoryId", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Price"
              placeholder="129000"
              type="number"
              value={form.price}
              onChange={(event) => updateForm("price", event.target.value)}
            />
            <Input
              label="Material"
              placeholder="Premium voal blend"
              value={form.material}
              onChange={(event) => updateForm("material", event.target.value)}
            />
            <Input
              label="Short description"
              placeholder="Soft matte pashmina with airy touch"
              value={form.shortDescription}
              onChange={(event) => updateForm("shortDescription", event.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Color"
                placeholder="Dusty Pink"
                value={form.colorName}
                onChange={(event) => updateForm("colorName", event.target.value)}
              />
              <Input
                label="Stock"
                min="0"
                type="number"
                value={form.stock}
                onChange={(event) => updateForm("stock", event.target.value)}
              />
            </div>
            <Input
              label="Size"
              placeholder="180 x 75 cm"
              value={form.size}
              onChange={(event) => updateForm("size", event.target.value)}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">Product image</span>
              <input
                className="input-field"
                type="file"
                accept="image/*"
                onChange={(event) => updateForm("imageFile", event.target.files?.[0] ?? null)}
              />
              <span className="mt-2 block text-xs font-semibold text-muted">
                {isSupabaseConfigured
                  ? "Uploaded to Supabase Storage bucket product-images."
                  : "Demo preview only until Supabase anon key is configured."}
              </span>
            </label>
          </div>
          {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
          {message && <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>}
          <Button className="mt-5 w-full" type="submit">
            {saving ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
          </Button>
        </form>
        <ProductTable
          products={tableProducts}
          onEdit={handleEditProduct}
          onArchive={handleArchiveProduct}
        />
      </div>
    </div>
  );
}
