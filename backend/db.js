/**
 * db.js — Database berbasis file JSON (tanpa library eksternal)
 * Data disimpan di folder data/ dalam file .json
 * Tidak perlu Python, tidak perlu compile, langsung jalan!
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Buat folder data jika belum ada
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Helper baca/tulis file JSON ───────────────────────────

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Seed data awal ────────────────────────────────────────

const SEED_PRODUCTS = [
  { id: 'prod-001', name: 'Buket Mawar Merah Romantis', description: 'Rangkaian buket mawar merah segar pilihan, cocok untuk hadiah ulang tahun, anniversary, atau ungkapan perasaan istimewa. Tersedia dalam kemasan premium.', price: 185000, stock: 12, category: 'Mawar', image: null, createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-10-01T10:00:00.000Z' },
  { id: 'prod-002', name: 'Buket Tulip Pastel', description: 'Kombinasi tulip warna pastel yang elegan—pink, lavender, dan putih. Tampilan modern dan feminin, ideal untuk wisuda atau hadiah apresiasi.', price: 220000, stock: 8, category: 'Tulip', image: null, createdAt: '2026-09-05T09:00:00.000Z', updatedAt: '2026-10-02T11:00:00.000Z' },
  { id: 'prod-003', name: 'Buket Matahari Ceria', description: 'Buket penuh semangat dengan bunga matahari kuning cerah, cocok untuk ucapan selamat, perpisahan, atau menambah keceriaan hari-hari spesial.', price: 165000, stock: 5, category: 'Matahari', image: null, createdAt: '2026-09-10T10:00:00.000Z', updatedAt: '2026-10-03T09:00:00.000Z' },
  { id: 'prod-004', name: 'Buket Mix Bunga Musim', description: 'Paduan bunga-bunga musiman pilihan yang disusun dengan indah. Setiap buket unik dan segar langsung dari kebun.', price: 250000, stock: 3, category: 'Mix', image: null, createdAt: '2026-09-15T11:00:00.000Z', updatedAt: '2026-10-04T14:00:00.000Z' },
  { id: 'prod-005', name: 'Buket Baby Breath Putih', description: 'Buket minimalis elegan dari baby breath putih nan lembut. Cocok untuk wisuda, pernikahan, atau hadiah yang anggun dan timeless.', price: 130000, stock: 0, category: 'Baby Breath', image: null, createdAt: '2026-09-20T08:30:00.000Z', updatedAt: '2026-10-05T08:00:00.000Z' },
  { id: 'prod-006', name: 'Buket Peony Premium', description: 'Bunga peony mewah dengan aroma harum alami. Hadir dalam nuansa pink lembut hingga fuchsia bold. Kemasan premium ribbon satin.', price: 320000, stock: 6, category: 'Peony', image: null, createdAt: '2026-09-25T09:00:00.000Z', updatedAt: '2026-10-06T10:00:00.000Z' },
];

const SEED_USERS = [
  { id: 'user-admin-01', username: 'admin', password: 'demo1234', name: 'Administrator Toko', role: 'admin', email: 'admin@buketbunga.com', phone: '081299998888', address: 'Kantor Pusat Florist, Jakarta', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'user-cust-01', username: 'user', password: 'user123', name: 'Siti Anggraini', role: 'customer', email: 'siti@gmail.com', phone: '081200000001', address: 'Jl. Mawar Melati No. 15, Jakarta Barat', createdAt: '2026-09-01T00:00:00.000Z' },
  { id: 'user-cust-02', username: 'budi', password: 'user123', name: 'Budi Santoso', role: 'customer', email: 'budi@gmail.com', phone: '081200000002', address: 'Jl. Dahlia No. 4, Bandung', createdAt: '2026-09-10T00:00:00.000Z' },
];

const SEED_ORDERS = [
  { id: 'ORD-2026-001', customerName: 'Nama Pelanggan A', phone: '081200000001', address: 'Jl. Contoh No. 1, Kota Contoh', note: 'Tolong tambahkan kartu ucapan.', total: 370000, status: 'Selesai', userId: null, items: [{ productId: 'prod-001', productNameSnapshot: 'Buket Mawar Merah Romantis', unitPriceSnapshot: 185000, quantity: 2, subtotal: 370000 }], createdAt: '2026-10-01T09:00:00.000Z', updatedAt: '2026-10-02T14:00:00.000Z' },
  { id: 'ORD-2026-002', customerName: 'Nama Pelanggan B', phone: '081200000002', address: 'Jl. Contoh No. 2, Kota Contoh', note: '', total: 385000, status: 'Diproses', userId: null, items: [{ productId: 'prod-002', productNameSnapshot: 'Buket Tulip Pastel', unitPriceSnapshot: 220000, quantity: 1, subtotal: 220000 }, { productId: 'prod-003', productNameSnapshot: 'Buket Matahari Ceria', unitPriceSnapshot: 165000, quantity: 1, subtotal: 165000 }], createdAt: '2026-10-05T11:00:00.000Z', updatedAt: '2026-10-05T13:00:00.000Z' },
  { id: 'ORD-2026-003', customerName: 'Nama Pelanggan C', phone: '081200000003', address: 'Jl. Contoh No. 3, Kota Contoh', note: 'Dikemas dengan pita merah ya.', total: 320000, status: 'Menunggu Konfirmasi', userId: null, items: [{ productId: 'prod-006', productNameSnapshot: 'Buket Peony Premium', unitPriceSnapshot: 320000, quantity: 1, subtotal: 320000 }], createdAt: '2026-10-10T10:30:00.000Z', updatedAt: '2026-10-10T10:30:00.000Z' },
  { id: 'ORD-2026-004', customerName: 'Nama Pelanggan D', phone: '081200000004', address: 'Jl. Contoh No. 4, Kota Contoh', note: '', total: 250000, status: 'Dibatalkan', userId: null, items: [{ productId: 'prod-004', productNameSnapshot: 'Buket Mix Bunga Musim', unitPriceSnapshot: 250000, quantity: 1, subtotal: 250000 }], createdAt: '2026-10-08T08:00:00.000Z', updatedAt: '2026-10-09T09:00:00.000Z' },
];

// Inisialisasi file jika belum ada
if (!readJson('products.json')) {
  writeJson('products.json', SEED_PRODUCTS);
  console.log('✅ products.json dibuat dengan data awal.');
}
if (!readJson('users.json')) {
  writeJson('users.json', SEED_USERS);
  console.log('✅ users.json dibuat dengan data awal.');
}
if (!readJson('orders.json')) {
  writeJson('orders.json', SEED_ORDERS);
  console.log('✅ orders.json dibuat dengan data awal.');
}

// ── Ekspor fungsi database ────────────────────────────────

module.exports = {
  // PRODUCTS
  getProducts:    () => readJson('products.json') || [],
  saveProducts:   (data) => writeJson('products.json', data),

  // USERS
  getUsers:       () => readJson('users.json') || [],
  saveUsers:      (data) => writeJson('users.json', data),

  // ORDERS
  getOrders:      () => readJson('orders.json') || [],
  saveOrders:     (data) => writeJson('orders.json', data),
};
