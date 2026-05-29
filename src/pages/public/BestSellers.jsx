import CollectionPage from "./CollectionPage.jsx";

export default function BestSellers() {
  return (
    <CollectionPage
      eyebrow="Best Sellers"
      title="Most trusted daily essentials."
      description="Produk terlaris berdasarkan data order item pada versi produksi. Demo memakai sold count dari mock data."
      filter={{ bestSeller: true, sort: "best-sellers" }}
    />
  );
}
