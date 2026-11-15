/**
 * useCart.js — Custom hook untuk mengakses keranjang belanja
 * Sistem Informasi Buket Bunga — RIBINKKOCH
 */

import { useContext } from 'react';
import { CartContext } from './cartContextDef.js';

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return ctx;
}
