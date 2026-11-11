import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { calcularTotalesCarrito } from '../utils/pricing.js';
import { buildCartItem } from '../utils/variants.js';

const CartContext = createContext(null);
const CART_KEY = 'intenso_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // Cada combinación producto + variante es un ítem independiente. El ítem
  // guarda la selección (`variant`, clave estable), el detalle de cada opción
  // (`variantDetails`: grupo, nombre, descripción, precio) y en `precio` el
  // precio de la variante elegida (el del producto queda en `precioProducto`),
  // así subtotal/total de pricing.js siguen funcionando sin cambios.
  const addItem = useCallback((product, variant, quantity = 1) => {
    const nuevo = buildCartItem(product, variant || {}, quantity);
    const variantKey = JSON.stringify(nuevo.variant);
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === product.id && JSON.stringify(i.variant || {}) === variantKey
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, nuevo];
    });
  }, []);

  const updateQuantity = useCallback((id, variantKey, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (
            item.id === id &&
            JSON.stringify(item.variant) === variantKey
          ) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        })
    );
  }, []);

  const removeItem = useCallback((id, variantKey) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && JSON.stringify(item.variant) === variantKey)
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // subtotalSinDescuento: precio base × cantidad de todo el carrito.
  // descuentoTotalAplicado: ahorro por descuentos directos + promos por volumen.
  // totalFinal (= total): lo que realmente se cobra.
  const { subtotalSinDescuento, descuentoTotalAplicado, totalFinal } = useMemo(
    () => calcularTotalesCarrito(items),
    [items]
  );
  const total = totalFinal;

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      subtotalSinDescuento,
      descuentoTotalAplicado,
      totalFinal,
      count,
      isDrawerOpen,
      setDrawerOpen,
    }),
    [
      items, addItem, updateQuantity, removeItem, clearCart,
      total, subtotalSinDescuento, descuentoTotalAplicado, totalFinal,
      count, isDrawerOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
