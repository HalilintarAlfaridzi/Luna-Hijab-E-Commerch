export default function ProductVisual({ product, className = "", compact = false }) {
  if (product.primaryImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] bg-linen ${className}`} aria-label={product.name}>
        <img
          src={product.primaryImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${product.imageTone} ${className}`}
      aria-label={product.name}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.65),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,.32),transparent_24%)]" />
      <div className="absolute -left-8 bottom-8 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-white/40" />
      <div className="relative flex h-full min-h-[220px] items-end justify-center p-6">
        <div
          className={`relative rounded-t-full bg-white/40 shadow-soft backdrop-blur-sm ${
            compact ? "h-36 w-28" : "h-56 w-40 sm:h-72 sm:w-52"
          }`}
        >
          <div className="absolute left-1/2 top-4 h-[86%] w-[68%] -translate-x-1/2 rounded-t-full bg-white/35" />
          <div className="absolute bottom-0 left-1/2 h-16 w-[135%] -translate-x-1/2 rounded-t-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}
