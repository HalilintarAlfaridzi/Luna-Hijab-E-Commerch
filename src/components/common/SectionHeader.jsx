import Button from "./Button.jsx";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  align = "left",
  tone = "light",
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={`mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "text-center sm:text-left" : ""
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className={`font-display text-3xl font-bold leading-tight sm:text-5xl ${isDark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-sm leading-7 sm:text-base ${isDark ? "text-white/65" : "text-muted"}`}>
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Button to={actionTo} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
