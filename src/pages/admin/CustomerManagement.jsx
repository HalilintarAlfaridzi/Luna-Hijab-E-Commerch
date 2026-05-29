import { formatCurrency } from "../../utils/formatCurrency.js";

const customers = [
  ["Aisyah", "aisyah@student.demo", 3, 327000, "2026-04-12"],
  ["Nabila", "nabila@work.demo", 7, 982000, "2026-03-03"],
  ["Hana", "hana@family.demo", 4, 516000, "2026-02-18"],
];

export default function CustomerManagement() {
  return (
    <div className="admin-card">
      <h2 className="font-display text-4xl font-bold text-ink">Customer Management</h2>
      <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-linen">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Orders</th>
              <th className="px-5 py-4">Total Spending</th>
              <th className="px-5 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen bg-white">
            {customers.map(([name, email, orders, spending, joined]) => (
              <tr key={email}>
                <td className="px-5 py-4 font-bold text-ink">{name}</td>
                <td className="px-5 py-4 text-muted">{email}</td>
                <td className="px-5 py-4 text-muted">{orders}</td>
                <td className="px-5 py-4 font-bold text-ink">{formatCurrency(spending)}</td>
                <td className="px-5 py-4 text-muted">{joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
