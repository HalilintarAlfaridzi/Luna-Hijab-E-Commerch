import { useEffect, useRef, useState } from "react";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import {
  archiveAdminCategory,
  getAdminCategories,
  restoreAdminCategory,
  saveAdminCategory,
} from "../../services/productService.js";
import { slugify } from "../../utils/slugify.js";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: "",
};

export default function CategoryManagement() {
  const formRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setCategories(await getAdminCategories());
    } catch (caughtError) {
      setError(caughtError.message);
    }
  }

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !editingId ? { slug: slugify(value) } : {}),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    try {
      const savedCategory = await saveAdminCategory(form, editingId);
      await loadCategories();
      setMessage(
        editingId
          ? `${savedCategory.name} berhasil diperbarui.`
          : `${savedCategory.name} berhasil disimpan.`,
      );
      setForm(initialForm);
      setEditingId(null);
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sortOrder: String(category.sortOrder ?? ""),
    });
    setError("");
    setMessage(`Sedang edit kategori ${category.name}.`);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleArchive = async (category) => {
    try {
      setCategories(await archiveAdminCategory(category.id));
      if (editingId === category.id) resetForm();
      setMessage(`${category.name} berhasil diarsipkan.`);
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  const handleRestore = async (category) => {
    try {
      setCategories(await restoreAdminCategory(category.id));
      setMessage(`${category.name} berhasil dipulihkan.`);
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form ref={formRef} className="admin-card" onSubmit={handleSubmit}>
        <h2 className="font-display text-3xl font-bold text-ink">
          {editingId ? "Edit Category" : "Create Category"}
        </h2>
        <div className="mt-5 grid gap-4">
          <Input
            label="Name"
            placeholder="Pashmina"
            value={form.name}
            onChange={(event) => updateForm("name", event.target.value)}
          />
          <Input
            label="Slug"
            placeholder="pashmina"
            value={form.slug}
            onChange={(event) => updateForm("slug", event.target.value)}
          />
          <Input
            label="Description"
            placeholder="Flowy essentials for daily wear"
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
          />
          <Input
            label="Sort order"
            min="0"
            type="number"
            placeholder="1"
            value={form.sortOrder}
            onChange={(event) => updateForm("sortOrder", event.target.value)}
          />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-[#C75146]/10 p-3 text-sm font-bold text-[#C75146]">{error}</p>}
        {message && <p className="mt-4 rounded-2xl bg-sage/10 p-3 text-sm font-bold text-sage">{message}</p>}
        <div className="mt-5 grid gap-3">
          <Button className="w-full" type="submit">
            {editingId ? "Update Category" : "Save Category"}
          </Button>
          {editingId && (
            <Button className="w-full" variant="secondary" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`admin-card ${category.isActive === false ? "opacity-70" : ""}`}
          >
            <div className={`mb-4 h-36 rounded-[1.5rem] bg-gradient-to-br ${category.imageTone}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">{category.name}</h2>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.22em] text-clay">
                  /{category.slug}
                </p>
              </div>
              <Badge tone={category.isActive === false ? "warning" : "success"}>
                {category.isActive === false ? "Archived" : "Active"}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted">{category.description}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Sort order: {category.sortOrder ?? 0}
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(category)}>
                Edit
              </Button>
              {category.isActive === false ? (
                <Button variant="ghost" size="sm" onClick={() => handleRestore(category)}>
                  Restore
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => handleArchive(category)}>
                  Archive
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
