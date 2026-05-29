import { useSearchParams } from "react-router-dom";
import ProductFilter from "../../components/product/ProductFilter.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";

const PAGE_SIZE = 8;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    category: searchParams.get("category") ?? "",
    search: searchParams.get("search") ?? "",
    sort: searchParams.get("sort") ?? "latest",
  };
  const page = Number(searchParams.get("page") ?? 1);
  const { products, categories, loading } = useProducts(filters);
  const { addItem } = useCart();

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilters = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    setSearchParams(params);
  };

  const quickAdd = (product) => {
    const variant = product.variants.find((item) => item.stock > 0) ?? product.variants[0];
    addItem(product, variant, 1);
  };

  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="mb-8 rounded-[2.5rem] bg-linen-radial p-6 shadow-card sm:p-10">
        <p className="eyebrow mb-4">Shop Collection</p>
        <div className="grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <h1 className="font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
              Find your daily shade.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Search, filter, sort, and preview stock per color. Layout dibuat
              mobile-first dengan filter yang tetap rapi di desktop.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white/70 p-5">
            <p className="text-sm font-bold text-muted">
              Showing <span className="text-clay">{visibleProducts.length}</span> of{" "}
              <span className="text-clay">{products.length}</span> curated products
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <ProductFilter
          categories={categories}
          activeCategory={filters.category}
          search={filters.search}
          sort={filters.sort}
          onChange={updateFilters}
        />
        <div>
          {loading ? (
            <div className="rounded-[2rem] border border-linen bg-white p-10 text-sm font-bold text-muted">
              Loading products...
            </div>
          ) : (
            <ProductGrid products={visibleProducts} onQuickAdd={quickAdd} />
          )}

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, index) => {
                const nextPage = index + 1;
                return (
                  <button
                    key={nextPage}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                      page === nextPage ? "bg-clay text-white" : "bg-white text-muted hover:text-clay"
                    }`}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("page", String(nextPage));
                      setSearchParams(params);
                    }}
                  >
                    {nextPage}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
