export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-2 block text-sm font-bold text-ink">{label}</span>}
      <input className="input-field" {...props} />
      {error && <span className="mt-2 block text-xs font-semibold text-[#C75146]">{error}</span>}
    </label>
  );
}
