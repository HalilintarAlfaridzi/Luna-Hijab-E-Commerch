import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  PartyPopper,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import ProductVisual from "../../components/product/ProductVisual.jsx";
import { reviews } from "../../data/mockData.js";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";

const trustPoints = [
  {
    title: "Premium Material",
    description: "Bahan ringan, jatuh rapi, dan nyaman untuk aktivitas panjang.",
    icon: Sparkles,
  },
  {
    title: "Stock per Variant",
    description: "Warna, ukuran, dan stok terlihat jelas sebelum masuk cart.",
    icon: PackageCheck,
  },
  {
    title: "Easy Checkout",
    description: "Checkout sederhana dengan simulasi bank transfer, COD, dan e-wallet.",
    icon: Truck,
  },
  {
    title: "Trusted Flow",
    description: "Order timeline dan admin dashboard membuat demo terasa realistis.",
    icon: ShieldCheck,
  },
];

const shopByNeed = [
  {
    title: "Daily Wear",
    description: "Ringan, rapi, dan aman dipakai untuk rutinitas harian.",
    to: "/shop?sort=latest",
    icon: Sparkles,
  },
  {
    title: "Work & Office",
    description: "Pilihan warna netral yang cocok untuk tampilan formal.",
    to: "/shop?category=square-hijab",
    icon: BriefcaseBusiness,
  },
  {
    title: "Campus Look",
    description: "Style praktis untuk aktivitas kuliah dan mobilitas tinggi.",
    to: "/shop?category=instant-hijab",
    icon: GraduationCap,
  },
  {
    title: "Formal / Event",
    description: "Material premium untuk acara, dinner, dan momen spesial.",
    to: "/shop?category=premium-collection",
    icon: PartyPopper,
  },
];

const orderSteps = [
  {
    title: "Choose product",
    description: "Pilih produk, warna, ukuran, lalu cek stok varian.",
  },
  {
    title: "Add to cart",
    description: "Masukkan barang ke cart dan lihat ringkasan total belanja.",
  },
  {
    title: "Fill shipping",
    description: "Isi alamat, nomor HP, dan catatan pengiriman.",
  },
  {
    title: "Confirm payment",
    description: "Pilih transfer manual, COD, atau e-wallet simulasi.",
  },
  {
    title: "Track status",
    description: "Order masuk ke histori, lalu admin bisa update statusnya.",
  },
];

export default function Home() {
  const { products, categories } = useProducts({ sort: "best-sellers" });
  const { addItem } = useCart();

  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 4);
  const heroProduct = featured[0] ?? products[0];

  const quickAdd = (product) => {
    const variant = product.variants.find((item) => item.stock > 0) ?? product.variants[0];
    addItem(product, variant, 1);
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-rose/20 blur-3xl" />
        <div className="section-shell grid min-h-[calc(100vh-9rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="animate-fade-up">
            <p className="eyebrow mb-5">Modern Hijab Essentials</p>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] text-ink sm:text-7xl lg:text-8xl">
              Modern Hijab for Everyday Elegance
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Hijab modern untuk perempuan aktif yang ingin tampil rapi, elegan,
              nyaman, dan percaya diri dalam aktivitas harian.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/shop" size="lg">
                Shop Collection <ArrowRight size={18} />
              </Button>
              <Button to="/new-arrivals" variant="secondary" size="lg">
                View New Arrivals
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 rounded-[2rem] border border-linen bg-white/70 p-3 shadow-card backdrop-blur">
              {[
                ["4.9/5", "Average rating"],
                ["1.8k+", "Products sold"],
                ["24h", "Admin response"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.5rem] bg-ivory p-4">
                  <p className="font-display text-2xl font-bold text-clay">{value}</p>
                  <p className="mt-1 text-xs font-bold text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {heroProduct && (
            <div className="relative animate-fade-up lg:pl-8" style={{ animationDelay: "120ms" }}>
              <div className="absolute -right-6 top-8 z-10 rounded-[2rem] bg-white p-4 shadow-soft">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-clay">
                  Best Seller
                </p>
                <p className="mt-1 font-display text-xl font-bold text-ink">{heroProduct.name}</p>
              </div>
              <ProductVisual product={heroProduct} className="aspect-[4/5] shadow-soft lg:aspect-[4/5]" />
              <div className="absolute -bottom-5 left-3 z-10 rounded-[2rem] bg-ink p-5 text-white shadow-soft sm:left-10">
                <p className="max-w-[16rem] text-sm leading-6 text-white/80">
                  Curated colors: Ivory, Dusty Pink, Sage, Mocha, and soft daily neutrals.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="Featured Collection"
          title="Produk pilihan dengan tampilan clean dan premium."
          description="Produk unggulan dipilih untuk menunjukkan varian warna, stok, rating, dan badge yang realistis."
          actionLabel="Explore Shop"
          actionTo="/shop"
        />
        <ProductGrid products={featured} onQuickAdd={quickAdd} />
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="Browse by Style"
          title="Kategori hijab untuk kebutuhan harian."
          description="Fashion e-commerce lebih mudah dipakai ketika user bisa mulai dari jenis hijab yang mereka cari."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-linen bg-white p-3 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className={`h-48 rounded-[1.5rem] bg-gradient-to-br ${category.imageTone} p-5`}>
                <div className="h-full rounded-[1.25rem] border border-white/40 bg-white/20" />
              </div>
              <div className="p-3">
                <h3 className="font-display text-2xl font-bold text-ink group-hover:text-clay">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="New Arrivals"
          title="Warna baru untuk capsule wardrobe modern."
          actionLabel="View All New"
          actionTo="/new-arrivals"
        />
        <ProductGrid products={newArrivals} onQuickAdd={quickAdd} />
      </section>

      <section className="bg-ink py-14 text-white sm:py-20">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Dibangun seperti produk e-commerce sungguhan."
            description="Tidak hanya landing page. Demo ini memuat produk, varian, cart, checkout, order, admin dashboard, inventory, dan schema Supabase."
            tone="dark"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-ink">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="Customer Trust"
          title="Review yang menjawab pain point customer fashion."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] border border-linen bg-white p-6 shadow-card">
              <div className="mb-5 flex gap-1 text-[#D89C3A]">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <CheckCircle2 key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-7 text-muted">"{review.comment}"</p>
              <div className="mt-6">
                <p className="font-display text-xl font-bold text-ink">{review.name}</p>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-clay">
                  {review.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="Shop by Need"
          title="Pilih hijab berdasarkan momen pakai."
          description="Section ini lebih membantu customer daripada daftar best seller karena mereka bisa mulai dari kebutuhan nyata."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {shopByNeed.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-[2rem] border border-linen bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay/10 text-clay">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink group-hover:text-clay">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-clay">
                  Explore
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <SectionHeader
          eyebrow="How to Order"
          title="Alur simulasi order yang bisa dicoba langsung."
          description="Bagian ini lebih relevan untuk portfolio karena menunjukkan bahwa flow checkout dan admin memang ada."
        />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2.5rem] border border-linen bg-white p-6 shadow-card sm:p-8">
            <div className="grid gap-4">
              {orderSteps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-[1.5rem] bg-ivory p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-clay text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-ink p-6 text-white shadow-soft sm:p-8">
            <p className="eyebrow mb-4 text-sand">Demo flow</p>
            <h3 className="font-display text-4xl font-bold leading-tight">
              Ready to try without a real payment gateway.
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Customer demo dan admin demo sudah disiapkan untuk portfolio. Order dibuat sebagai simulasi, lalu admin bisa ubah statusnya di backoffice.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sand">Customer demo</p>
                <p className="mt-2 text-sm font-bold text-white">customer@demo.com / customer123</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sand">Admin demo</p>
                <p className="mt-2 text-sm font-bold text-white">admin@demo.com / admin123</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button to="/shop" variant="light" size="lg">
                Start Shopping
              </Button>
              <Button to="/login" variant="secondary" size="lg">
                Open Demo Login
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
