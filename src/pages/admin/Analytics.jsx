import { revenueData } from "../../data/mockData.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export default function Analytics() {
  const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));

  return (
    <div className="grid gap-6">
      <div className="admin-card">
        <p className="eyebrow mb-2">Analytics</p>
        <h2 className="font-display text-4xl font-bold text-ink">Sales by Month</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Recharts dipakai untuk visual analytics portfolio. Versi production bisa membaca view/RPC Supabase.
        </p>
      </div>
      <div className="admin-card">
        <div className="grid gap-4">
          {revenueData.map((item) => (
            <div key={item.month} className="grid gap-2 rounded-2xl bg-ivory p-4 sm:grid-cols-[70px_1fr_140px] sm:items-center">
              <p className="font-display text-2xl font-bold text-ink">{item.month}</p>
              <div className="h-5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-clay to-sand"
                  style={{ width: `${Math.max(12, (item.revenue / maxRevenue) * 100)}%` }}
                />
              </div>
              <div className="text-sm font-bold text-clay sm:text-right">
                {formatCurrency(item.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
