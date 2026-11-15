/**
 * ProductsContext.jsx — Sumber data produk tunggal (admin & user)
 * Semua komponen membaca dari context ini sehingga perubahan admin
 * langsung terlihat di halaman user tanpa perlu reload.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getProducts as fetchProducts,
  getCategories as fetchCategories,
  createProduct as apiCreate,
  updateProduct as apiUpdate,
  deleteProduct as apiDelete,
} from '../services/mockService.js';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load awal
  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const [prodList, catList] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(prodList);
      setCategories(catList);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // --- CRUD — semua mengupdate state global langsung ---

  const addProduct = useCallback(async (data) => {
    const created = await apiCreate(data);
    setProducts((prev) => [...prev, created]);
    // Update kategori jika baru
    if (created.category && !categories.includes(created.category)) {
      setCategories((prev) => [...prev, created.category]);
    }
    return created;
  }, [categories]);

  const editProduct = useCallback(async (id, data) => {
    const updated = await apiUpdate(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const removeProduct = useCallback(async (id) => {
    await apiDelete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        addProduct,
        editProduct,
        removeProduct,
        reload: loadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

/** Hook — gunakan di halaman admin maupun user */
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts harus dipakai di dalam ProductsProvider');
  return ctx;
}

