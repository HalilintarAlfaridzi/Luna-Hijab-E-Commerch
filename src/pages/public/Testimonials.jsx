import { Star } from "lucide-react";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { reviews } from "../../data/mockData.js";

export default function Testimonials() {
  return (
    <section className="section-shell py-10 sm:py-14">
      <SectionHeader
        eyebrow="Testimonials"
        title="Customer proof for a new fashion brand."
        description="Review approved dari customer membantu mengurangi keraguan soal warna, bahan, dan proses order."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-[2rem] border border-linen bg-white p-6 shadow-card">
            <div className="mb-5 flex gap-1 text-[#D89C3A]">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="text-sm leading-7 text-muted">"{review.comment}"</p>
            <div className="mt-6">
              <h2 className="font-display text-2xl font-bold text-ink">{review.name}</h2>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-clay">{review.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
