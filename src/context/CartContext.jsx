import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "luna-hijab-cart";
const SHIPPING_ESTIMATE = 18000;

function makeLineId(product, variant) {
  return `${product.id}-${variant.colorName}-${variant.size}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    const lineId = makeLineId(product, variant);
    const maxQuantity = variant.stock;

    if (maxQuantity < 1) {
      return { ok: false, message: "Variant ini sedang habis." };
    }

    setItems((current) => {
      const existing = current.find((item) => item.id === lineId);
      if (existing) {
        return current.map((item) =>
          item.id === lineId
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
            : item,
        );
      }

      return [
        ...current,
        {
          id: lineId,
          product,
          variant,
          quantity: Math.min(quantity, maxQuantity),
          priceSnapshot: product.effectivePrice ?? product.salePrice ?? product.price,
        },
      ];
    });

    return { ok: true };
  };

  const updateQuantity = (lineId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.id === lineId
          ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.variant.stock)) }
          : item,
      ),
    );
  };

  const removeItem = (lineId) => {
    setItems((current) => current.filter((item) => item.id !== lineId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
    const shipping = items.length ? SHIPPING_ESTIMATE : 0;
    const discount = subtotal >= 300000 ? 25000 : 0;

    return {
      subtotal,
      shipping,
      discount,
      total: Math.max(0, subtotal + shipping - discount),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, totals, addItem, updateQuantity, removeItem, clearCart }),
    [items, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
