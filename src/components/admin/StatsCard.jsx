export default function StatsCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-muted">{label}</p>
          <p className="mt-3 font-display text-3xl font-bold text-ink">{value}</p>
          {helper && <p className="mt-2 text-sm font-semibold text-sage">{helper}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay/10 text-clay">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
