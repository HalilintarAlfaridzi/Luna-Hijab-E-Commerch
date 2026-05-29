import { formatCurrency } from "../../utils/formatCurrency.js";
import { ORDER_STATUS } from "../../utils/constants.js";
import Badge from "../common/Badge.jsx";

function toneForStatus(status) {
  if (status === "completed") return "success";
  if (status === "pending_payment") return "warning";
  return "default";
}

function formatOrderDate(date) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatOrderItems(items = []) {
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      return `${item.quantity}x ${item.productName}${item.variant ? ` (${item.variant})` : ""}`;
    })
    .join(", ");
}

export default function OrderTable({ orders, onAcceptPayment, onStatusChange }) {
  const showActions = Boolean(onAcceptPayment || onStatusChange);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-linen bg-white">
      <div className="block sm:hidden">
        <div className="grid divide-y divide-linen">
          {orders.map((order) => (
            <article key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">{order.orderNumber ?? order.id}</p>
                  <p className="mt-1 text-xs text-muted">{formatOrderDate(order.date)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge tone={order.paymentStatus === "paid" ? "success" : "warning"}>
                    {order.paymentStatus}
                  </Badge>
                  <Badge tone={toneForStatus(order.status)}>{order.status.replaceAll("_", " ")}</Badge>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                {formatOrderItems(order.items)}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Total</p>
                  <p className="mt-1 font-bold text-ink">{formatCurrency(order.total)}</p>
                </div>
                {showActions && (
                  <div className="flex flex-wrap justify-end gap-2">
                    {onAcceptPayment && order.paymentStatus !== "paid" && order.status === "pending_payment" && (
                      <button
                        className="rounded-full bg-sage px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-clay"
                        type="button"
                        onClick={() => onAcceptPayment(order.id)}
                      >
                        Accept
                      </button>
                    )}
                    {onStatusChange && (
                      <select
                        className="rounded-full border border-linen bg-white px-3 py-2 text-[11px] font-bold text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                        value={order.status}
                        onChange={(event) => onStatusChange(order.id, event.target.value)}
                      >
                        {ORDER_STATUS.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Total</th>
              {showActions && <th className="px-5 py-4">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-linen">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">{order.orderNumber ?? order.id}</p>
                  <p className="text-xs text-muted">{formatOrderDate(order.date)}</p>
                </td>
                <td className="max-w-[280px] px-5 py-4 text-muted">{formatOrderItems(order.items)}</td>
                <td className="px-5 py-4">
                  <Badge tone={order.paymentStatus === "paid" ? "success" : "warning"}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={toneForStatus(order.status)}>{order.status.replaceAll("_", " ")}</Badge>
                </td>
                <td className="px-5 py-4 font-bold text-ink">{formatCurrency(order.total)}</td>
                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex min-w-[240px] flex-wrap items-center gap-2">
                      {onAcceptPayment && order.paymentStatus !== "paid" && order.status === "pending_payment" && (
                        <button
                          className="rounded-full bg-sage px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-clay"
                          type="button"
                          onClick={() => onAcceptPayment(order.id)}
                        >
                          Accept Payment
                        </button>
                      )}
                      {onStatusChange && (
                        <select
                          className="rounded-full border border-linen bg-white px-3 py-2 text-xs font-bold text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                          value={order.status}
                          onChange={(event) => onStatusChange(order.id, event.target.value)}
                        >
                          {ORDER_STATUS.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
