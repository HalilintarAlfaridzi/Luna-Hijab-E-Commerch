const badgeStyles = {
  default: "bg-white/90 text-clay",
  sale: "bg-rose text-white",
  premium: "bg-ink text-white",
  success: "bg-sage text-white",
  warning: "bg-[#D89C3A] text-white",
};

export default function Badge({ children, tone = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${badgeStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
