import ProductVisual from "./ProductVisual.jsx";

export default function ProductImageGallery({ product, selectedVariant, onSelectVariant }) {
  const images = product.images ?? [];

  return (
    <div>
      <ProductVisual product={product} className="aspect-[4/5] sm:aspect-square" />
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image) => (
            <div key={image.id ?? image.image_url} className="aspect-square overflow-hidden rounded-2xl border border-linen bg-white">
              <img
                src={image.image_url}
                alt={image.alt_text ?? product.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {product.variants.map((variant) => (
          <button
            key={`${variant.colorName}-${variant.size}`}
            type="button"
            className={`rounded-2xl border p-2 transition ${
              selectedVariant?.colorName === variant.colorName
                ? "border-clay bg-white"
                : "border-linen bg-white/60 hover:border-sand"
            }`}
            onClick={() => onSelectVariant(variant)}
            aria-label={`Select ${variant.colorName}`}
          >
            <span
              className="block h-16 rounded-xl"
              style={{ backgroundColor: variant.colorHex }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
