/**
 * mockService.js — Service layer yang terhubung ke Backend API
 *
 * Semua fungsi memanggil REST API backend di http://localhost:3001
 * Data tersimpan permanen di file JSON (backend/data/)
 *
 * Sistem Informasi Buket Bunga
 */

const BASE_URL = 'http://localhost:3001/api';

// Export ORDER_STATUS agar kompatibel dengan kode lama
export const ORDER_STATUS = {
  PENDING:    'Menunggu Konfirmasi',
  PROCESSING: 'Diproses',
  DONE:       'Selesai',
  CANCELLED:  'Dibatalkan',
};

export const USER_ROLES = {
  ADMIN:    'admin',
  CUSTOMER: 'customer',
};

// ── Helper fetch ──────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan pada server.');
  return data;
}

// ════════════════════════════════════════════════════════════
// PRODUK
// ════════════════════════════════════════════════════════════

export async function getProducts() {
  return apiFetch('/products');
}

export async function getProductById(id) {
  return apiFetch(`/products/${id}`);
}

export async function createProduct(data) {
  return apiFetch('/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id, data) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}

export async function updateStock(id, stock) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify({ stock }) });
}

export async function getCategories() {
  return apiFetch('/products/categories');
}

// ════════════════════════════════════════════════════════════
// PESANAN
// ════════════════════════════════════════════════════════════

export async function getOrders() {
  return apiFetch('/orders');
}

export async function getOrderById(id) {
  return apiFetch(`/orders/${id}`);
}

export async function createOrder(data) {
  return apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateOrderStatus(id, status) {
  return apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function checkOrderStatus(orderId, phone) {
  return apiFetch('/orders/check-status', { method: 'POST', body: JSON.stringify({ orderId, phone }) });
}

export async function getOrdersByCustomer(phoneOrUserId) {
  if (!phoneOrUserId) return [];
  return apiFetch(`/orders/customer/${encodeURIComponent(phoneOrUserId)}`);
}

// ════════════════════════════════════════════════════════════
// AUTH & PENGGUNA
// ════════════════════════════════════════════════════════════

export async function loginAdmin(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, role: 'admin' }),
  });
}

export async function loginCustomer(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, role: 'customer' }),
  });
}

export async function loginUser(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function registerCustomer(data) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: 'customer' }),
  });
}

export async function registerAdmin(data) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: 'admin' }),
  });
}

export async function changePassword(username, oldPassword, newPassword) {
  return apiFetch('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });
}

export async function logoutAdmin() {
  return { success: true };
}

export async function logoutUser() {
  return { success: true };
}

// ════════════════════════════════════════════════════════════
// LAPORAN
// ════════════════════════════════════════════════════════════

export async function getReportSummary() {
  return apiFetch('/reports/summary');
}
