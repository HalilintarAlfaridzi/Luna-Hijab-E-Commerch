import { PackageOpen } from "lucide-react";
import Button from "./Button.jsx";

export default function EmptyState({
  title = "Belum ada data",
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-sand bg-white/70 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linen text-clay">
        <PackageOpen size={24} />
      </div>
      <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Button to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
