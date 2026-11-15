/**
 * CartContext.jsx — Provider state keranjang belanja (Multi-item)
 * Sistem Informasi Buket Bunga — RIBINKKOCH
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CartContext } from './cartContextDef.js';

function getInitialCart() {
  try {
    const saved = localStorage.getItem('ribinkkoch_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart);
  const [toast, setToast] = useState(null);

  // Simpan ke localStorage saat keranjang berubah
  useEffect(() => {
    try {
      localStorage.setItem('ribinkkoch_cart', JSON.stringify(items));
    } catch {
      // abaikan jika storage penuh
    }
  }, [items]);

  // Otomatis tutup toast notifikasi setelah 3.5 detik
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showNotification = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  /**
   * Menambahkan produk ke keranjang
   */
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showNotification('Maaf, stok buket ini sedang habis.', 'error');
      return false;
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + qtyToAdd);

        if (currentQty >= product.stock) {
          showNotification(`Jumlah buket "${product.name}" sudah mencapai batas stok maksimum (${product.stock}).`, 'warning');
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showNotification(`Berhasil menambahkan ${qtyToAdd}x "${product.name}" ke keranjang!`);
        return updated;
      }

      // Produk baru di keranjang
      const finalQty = Math.min(product.stock, qtyToAdd);
      showNotification(`"${product.name}" berhasil ditambahkan ke keranjang!`);
      return [...prevItems, { product, quantity: finalQty }];
    });

    return true;
  }, [showNotification]);

  /**
   * Mengubah jumlah item di keranjang
   */
  const updateQuantity = useCallback((productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id !== productId) return item;
        const maxStock = item.product.stock;
        const finalQty = Math.min(maxStock, qty);
        if (qty > maxStock) {
          showNotification(`Maksimum pesanan untuk "${item.product.name}" adalah ${maxStock} buket.`, 'warning');
        }
        return { ...item, quantity: finalQty };
      });
    });
  }, [showNotification]);

  /**
   * Menghapus produk dari keranjang
   */
  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.product.id === productId);
      if (target) {
        showNotification(`"${target.product.name}" dihapus dari keranjang.`, 'info');
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  }, [showNotification]);

  /**
   * Mengosongkan keranjang
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Total jumlah seluruh buket di keranjang
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Total harga seluruh buket di keranjang
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        toast,
        dismissToast: () => setToast(null),
      }}
    >
      {children}
      {/* Toast Notifikasi Melayang */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : 'var(--color-pink-primary)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: 'var(--font-size-sm)',
            maxWidth: '380px',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <span>{toast.type === 'error' ? '⚠️' : toast.type === 'warning' ? '🔔' : '🌸'}</span>
          <div style={{ flex: 1, fontWeight: 500 }}>{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: 0.8,
            }}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}
