import EmptyState from "../../components/common/EmptyState.jsx";

export default function NotFound() {
  return (
    <section className="section-shell py-20">
      <EmptyState
        title="Page not found"
        description="Route ini belum tersedia atau alamatnya salah."
        actionLabel="Back Home"
        actionTo="/"
      />
    </section>
  );
}
