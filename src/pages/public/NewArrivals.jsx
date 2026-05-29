import CollectionPage from "./CollectionPage.jsx";

export default function NewArrivals() {
  return (
    <CollectionPage
      eyebrow="New Arrivals"
      title="Fresh colors and silhouettes."
      description="Produk terbaru berdasarkan flag is_new_arrival. Pada versi Supabase bisa diurutkan dari created_at."
      filter={{ newest: true, sort: "latest" }}
    />
  );
}
