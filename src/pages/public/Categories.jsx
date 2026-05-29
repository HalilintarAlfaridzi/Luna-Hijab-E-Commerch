import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useProducts } from "../../hooks/useProducts.js";

export default function Categories() {
  const { categories } = useProducts({ sort: "latest" });

  return (
    <section className="section-shell py-10 sm:py-14">
      <SectionHeader
        eyebrow="Categories"
        title="Start from the hijab type."
        description="Kategori dibuat eksplisit agar customer bisa membandingkan jenis hijab tanpa browsing terlalu lama."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="group rounded-[2rem] border border-linen bg-white p-3 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className={`h-64 rounded-[1.5rem] bg-gradient-to-br ${category.imageTone} p-5`}>
              <div className="h-full rounded-[1.5rem] border border-white/40 bg-white/20" />
            </div>
            <div className="p-3">
              <h2 className="font-display text-3xl font-bold text-ink group-hover:text-clay">
                {category.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
