import SectionHeader from "../../components/common/SectionHeader.jsx";

const faqs = [
  ["Bagaimana cara order?", "Pilih produk, pilih varian warna/ukuran, tambah ke cart, lalu checkout setelah login."],
  ["Apa metode pembayaran?", "Demo mendukung bank transfer manual, COD, dan e-wallet dummy. Tidak ada kartu asli yang disimpan."],
  ["Berapa lama pengiriman?", "Estimasi demo 2-5 hari kerja tergantung kota tujuan."],
  ["Apakah warna produk sama dengan foto?", "UI menampilkan swatch warna dan detail varian. Pada produksi perlu foto produk real dan disclaimer lighting."],
  ["Bisa refund atau return?", "Flow status mendukung cancelled/refunded untuk pengembangan lanjutan."],
];

export default function FAQ() {
  return (
    <section className="section-shell py-10 sm:py-14">
      <SectionHeader
        eyebrow="FAQ"
        title="Jawaban singkat sebelum customer checkout."
        description="FAQ mengurangi friksi dan membangun trust untuk toko online baru."
      />
      <div className="grid gap-4">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-[1.5rem] border border-linen bg-white p-5 shadow-card">
            <summary className="cursor-pointer list-none font-display text-2xl font-bold text-ink">
              {question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
