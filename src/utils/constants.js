export const ORDER_STATUS = [
  "pending_payment",
  "paid",
  "processing",
  "packed",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
];

export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Manual Bank Transfer" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "e_wallet_dummy", label: "E-Wallet Simulation" },
];
