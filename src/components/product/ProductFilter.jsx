import { Search, SlidersHorizontal } from "lucide-react";

export default function ProductFilter({
  categories,
  activeCategory,
  search,
  sort,
  onChange,
}) {
  return (
    <aside className="rounded-[2rem] border border-linen bg-white p-4 shadow-card lg:sticky lg:top-24 lg:self-start">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink">Filter</h2>
        <SlidersHorizontal className="text-clay" size={20} />
      </div>

      <label className="relative block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          className="input-field pl-11"
          placeholder="Search hijab..."
          value={search}
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </label>

      <div className="mt-6">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-muted">Category</p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          <button
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              !activeCategory ? "bg-clay text-white" : "bg-ivory text-muted hover:text-clay"
            }`}
            type="button"
            onClick={() => onChange({ category: "" })}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-full px-4 py-2 text-left text-sm font-bold transition ${
                activeCategory === category.slug
                  ? "bg-clay text-white"
                  : "bg-ivory text-muted hover:text-clay"
              }`}
              type="button"
              onClick={() => onChange({ category: category.slug })}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-6 block">
        <span className="mb-3 block text-xs font-extrabold uppercase tracking-[0.22em] text-muted">
          Sort
        </span>
        <select
          className="input-field"
          value={sort}
          onChange={(event) => onChange({ sort: event.target.value })}
        >
          <option value="latest">Latest</option>
          <option value="best-sellers">Best sellers</option>
          <option value="rating">Highest rating</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </select>
      </label>
    </aside>
  );
}
