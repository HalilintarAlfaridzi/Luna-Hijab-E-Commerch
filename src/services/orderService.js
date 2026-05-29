import { demoOrders } from "../data/mockData.js";
import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

const DEMO_ORDERS_KEY = "luna-hijab-demo-orders";
const PAID_STATUSES = ["paid", "processing", "packed", "shipped", "completed"];
const DEMO_CUSTOMER_ID = "demo-customer";

function normalizeOrder(order) {
  const orderNumber = order.orderNumber ?? order.id;
  const rawItems = order.items ?? order.order_items ?? [];

  return {
    id: order.id ?? orderNumber,
    orderNumber,
    userId: order.userId ?? order.user_id ?? DEMO_CUSTOMER_ID,
    customerEmail: order.customerEmail ?? order.customer_email ?? "customer@demo.com",
    date: order.date ?? order.created_at ?? new Date().toISOString(),
    status: order.status ?? "pending_payment",
    paymentStatus: order.paymentStatus ?? order.payment_status ?? "unpaid",
    paymentMethod: order.paymentMethod ?? order.payment_method ?? "bank_transfer",
    shipping: order.shipping ?? null,
    total: order.total ?? order.total_amount ?? 0,
    items: rawItems.map((item) =>
      typeof item === "string"
        ? item
        : {
            productName: item.productName ?? item.product_name_snapshot ?? item.product_name ?? "Product",
            variant: item.variant ?? item.variant_snapshot ?? "",
            quantity: item.quantity ?? 1,
            price: item.price ?? item.price_snapshot ?? 0,
          },
    ),
    updatedAt: order.updatedAt ?? order.updated_at ?? null,
  };
}

function readStoredOrders() {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(DEMO_ORDERS_KEY);
    return stored ? JSON.parse(stored).map(normalizeOrder) : null;
  } catch {
    return null;
  }
}

function writeStoredOrders(orders) {
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders.map(normalizeOrder)));
}

export function createDemoOrder({ cartItems, shipping, paymentMethod, totals, user }) {
  const orderNumber = `ORD-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.floor(
    100 + Math.random() * 900,
  )}`;

  const order = normalizeOrder({
    id: orderNumber,
    orderNumber,
    userId: user?.id ?? DEMO_CUSTOMER_ID,
    customerEmail: user?.email ?? "customer@demo.com",
    date: new Date().toISOString(),
    status: "pending_payment",
    paymentStatus: "unpaid",
    paymentMethod,
    shipping,
    total: totals.total,
    items: cartItems.map((item) => ({
      productName: item.product.name,
      variant: `${item.variant.colorName} / ${item.variant.size}`,
      quantity: item.quantity,
      price: item.priceSnapshot,
    })),
  });

  writeStoredOrders([order, ...getDemoOrders()]);

  return order;
}

export async function createOrder({ cartItems, shipping, paymentMethod, totals, user }) {
  if (!isSupabaseConfigured) {
    return createDemoOrder({ cartItems, shipping, paymentMethod, totals, user });
  }

  const rpcItems = cartItems.map((item) => ({
    product_id: item.product.id,
    variant_id: item.variant.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("create_order_from_cart", {
    p_items: rpcItems,
    p_shipping: shipping,
    p_payment_method: paymentMethod,
    p_customer_notes: shipping.notes ?? "",
    p_shipping_cost: totals.shipping,
    p_discount_amount: totals.discount,
  });

  if (error) throw error;
  return normalizeOrder(data);
}

export function getDemoOrders() {
  return readStoredOrders() ?? demoOrders.map(normalizeOrder);
}

export function getDemoOrdersForUser(userId) {
  if (!userId) return [];
  return getDemoOrders().filter((order) => order.userId === userId);
}

export async function getAdminOrders() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(normalizeOrder);
  }

  return getDemoOrders();
}

export async function getCustomerOrders(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(normalizeOrder);
  }

  return getDemoOrdersForUser(userId);
}

export function updateDemoOrderStatus(orderId, nextStatus) {
  const orders = getDemoOrders();
  const nextOrders = orders.map((order) => {
    if (order.id !== orderId && order.orderNumber !== orderId) return order;

    const nextPaymentStatus =
      nextStatus === "pending_payment"
        ? "unpaid"
        : nextStatus === "refunded"
        ? "refunded"
        : PAID_STATUSES.includes(nextStatus)
          ? "paid"
          : order.paymentStatus;

    return {
      ...order,
      status: nextStatus,
      paymentStatus: nextPaymentStatus,
      updatedAt: new Date().toISOString(),
    };
  });

  writeStoredOrders(nextOrders);
  return nextOrders;
}

function paymentStatusForOrderStatus(nextStatus, currentPaymentStatus = "unpaid") {
  if (nextStatus === "pending_payment") return "unpaid";
  if (nextStatus === "refunded") return "refunded";
  if (PAID_STATUSES.includes(nextStatus)) return "paid";
  return currentPaymentStatus;
}

export async function updateOrderStatus(orderId, nextStatus) {
  if (isSupabaseConfigured) {
    const paymentStatus = paymentStatusForOrderStatus(nextStatus);
    const { error } = await supabase
      .from("orders")
      .update({
        status: nextStatus,
        payment_status: paymentStatus,
      })
      .eq("id", orderId);

    if (error) throw error;
    return getAdminOrders();
  }

  return updateDemoOrderStatus(orderId, nextStatus);
}

export function acceptDemoPayment(orderId) {
  return updateDemoOrderStatus(orderId, "paid");
}

export async function acceptPayment(orderId) {
  return updateOrderStatus(orderId, "paid");
}

export function exportDemoOrdersCsv(orders = getDemoOrders()) {
  const headers = ["order_number", "date", "status", "payment_status", "payment_method", "total"];
  const rows = orders.map((order) =>
    [
      order.orderNumber,
      order.date,
      order.status,
      order.paymentStatus,
      order.paymentMethod,
      order.total,
    ]
      .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
