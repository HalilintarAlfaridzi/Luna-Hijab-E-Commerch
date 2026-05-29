import { CheckCircle2 } from "lucide-react";
import SectionHeader from "../../components/common/SectionHeader.jsx";

const values = [
  "Premium look dengan harga tetap terjangkau",
  "Warna modern, soft, dan mudah dipadukan",
  "Informasi bahan, ukuran, stok, dan care instruction jelas",
  "Checkout sederhana tanpa menyimpan data kartu asli",
];

export default function About() {
  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2.5rem] bg-linen-radial p-6 shadow-soft">
          <div className="aspect-[4/5] rounded-[2rem] border border-white/60 bg-white/30 p-8">
            <div className="h-full rounded-t-full bg-white/35 shadow-soft" />
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="About Brand"
            title="Modern hijab brand with elegant daily essentials."
            description="Luna Hijab adalah konsep e-commerce fashion muslim yang menempatkan trust, visual, dan product information sebagai fondasi utama pengalaman belanja."
          />
          <div className="grid gap-3">
            {values.map((value) => (
              <div key={value} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
                <CheckCircle2 className="text-sage" size={20} />
                <p className="text-sm font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
