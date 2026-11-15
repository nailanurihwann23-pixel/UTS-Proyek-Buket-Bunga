/**
 * server.js — Express API Server untuk Sistem Informasi Buket Bunga
 * PORT: 3001  |  Database: file JSON (tanpa library eksternal)
 */

const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ════════════════════════════════════════════════════════════
// PRODUK
// ════════════════════════════════════════════════════════════

// GET /api/products
app.get('/api/products', (req, res) => {
  res.json(db.getProducts());
});

// GET /api/products/categories
app.get('/api/products/categories', (req, res) => {
  const products = db.getProducts();
  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
  res.json(cats);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = db.getProducts().find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: `Produk "${req.params.id}" tidak ditemukan.` });
  res.json(product);
});

// POST /api/products — tambah produk baru
app.post('/api/products', (req, res) => {
  const { name, description, price, stock, category, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Nama produk wajib diisi.' });

  const products = db.getProducts();
  const now = new Date().toISOString();
  const newProduct = {
    id:          `prod-${Date.now()}`,
    name,
    description: description || '',
    price:       Number(price) || 0,
    stock:       Number(stock) || 0,
    category:    category || 'Umum',
    image:       image || null,
    createdAt:   now,
    updatedAt:   now,
  };
  products.push(newProduct);
  db.saveProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id — edit produk
app.put('/api/products/:id', (req, res) => {
  const products = db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: `Produk "${req.params.id}" tidak ditemukan.` });

  products[idx] = {
    ...products[idx],
    ...req.body,
    id:        products[idx].id,
    updatedAt: new Date().toISOString(),
  };
  db.saveProducts(products);
  res.json(products[idx]);
});

// DELETE /api/products/:id — hapus produk
app.delete('/api/products/:id', (req, res) => {
  const products = db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: `Produk "${req.params.id}" tidak ditemukan.` });

  products.splice(idx, 1);
  db.saveProducts(products);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// PESANAN
// ════════════════════════════════════════════════════════════

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const orders = db.getOrders();
  res.json(orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrders().find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: `Pesanan "${req.params.id}" tidak ditemukan.` });
  res.json(order);
});

// POST /api/orders — buat pesanan baru
app.post('/api/orders', (req, res) => {
  const { customerName, phone, address, note, items, userId } = req.body;
  if (!customerName || !phone || !items?.length) {
    return res.status(400).json({ error: 'customerName, phone, dan items wajib diisi.' });
  }

  const orders  = db.getOrders();
  const total   = items.reduce((s, i) => s + (i.subtotal || i.unitPriceSnapshot * i.quantity), 0);
  const orderId = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
  const now     = new Date().toISOString();

  const newOrder = {
    id: orderId,
    customerName,
    phone,
    address: address || '',
    note:    note    || '',
    total,
    status:  'Menunggu Konfirmasi',
    userId:  userId || null,
    items,
    createdAt: now,
    updatedAt: now,
  };
  orders.push(newOrder);
  db.saveOrders(orders);
  res.status(201).json(newOrder);
});

// PATCH /api/orders/:id/status — update status
app.patch('/api/orders/:id/status', (req, res) => {
  const VALID = ['Menunggu Konfirmasi', 'Diproses', 'Selesai', 'Dibatalkan'];
  const { status } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ error: `Status tidak valid: "${status}".` });

  const orders = db.getOrders();
  const idx    = orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: `Pesanan "${req.params.id}" tidak ditemukan.` });

  orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
  db.saveOrders(orders);
  res.json(orders[idx]);
});

// POST /api/orders/check-status — cek status pelanggan
app.post('/api/orders/check-status', (req, res) => {
  const { orderId, phone } = req.body;
  const order = db.getOrders().find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });

  const cleanInput  = (phone || '').replace(/\D/g, '');
  const cleanStored = (order.phone || '').replace(/\D/g, '');
  if (cleanInput !== cleanStored) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan. Periksa kembali kode pesanan dan nomor telepon.' });
  }
  res.json(order);
});

// GET /api/orders/customer/:phone — pesanan berdasarkan HP
app.get('/api/orders/customer/:phone', (req, res) => {
  const cleanPhone = req.params.phone.replace(/\D/g, '');
  const orders = db.getOrders().filter((o) => {
    const stored = (o.phone || '').replace(/\D/g, '');
    return stored === cleanPhone || o.userId === req.params.phone;
  });
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════

function safeUser(user) {
  const { password: _p, ...safe } = user;
  return safe;
}

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi.' });

  const trimmed = username.trim().toLowerCase();
  const users   = db.getUsers();
  const found   = users.find((u) => {
    const matchId =
      u.username.toLowerCase() === trimmed ||
      (u.email  && u.email.toLowerCase()  === trimmed) ||
      (u.phone  && u.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, ''));
    const matchPwd  = u.password === password;
    const matchRole = !role || u.role === role;
    return matchId && matchPwd && matchRole;
  });

  if (!found) return res.status(401).json({ error: 'Identitas atau kata sandi salah.' });
  res.json({ success: true, user: safeUser(found) });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, phone, email, address, role } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Username, password, dan nama wajib diisi.' });
  }

  const users = db.getUsers();
  if (users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
    return res.status(409).json({ error: `Username "${username}" sudah digunakan.` });
  }
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (users.find((u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhone)) {
      return res.status(409).json({ error: 'Nomor telepon sudah terdaftar.' });
    }
  }

  const now     = new Date().toISOString();
  const newUser = {
    id:        `user-${role === 'admin' ? 'admin' : 'cust'}-${Date.now()}`,
    username:  username.trim(),
    password,
    name:      name.trim(),
    role:      role || 'customer',
    email:     email   || '',
    phone:     phone   || '',
    address:   address || '',
    createdAt: now,
  };
  users.push(newUser);
  db.saveUsers(users);
  res.status(201).json({ success: true, user: safeUser(newUser) });
});

// PATCH /api/auth/change-password
app.patch('/api/auth/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const users = db.getUsers();
  const idx   = users.findIndex((u) => u.username.toLowerCase() === username?.trim().toLowerCase());
  if (idx === -1) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  if (users[idx].password !== oldPassword) return res.status(401).json({ error: 'Kata sandi lama tidak cocok.' });

  users[idx].password = newPassword;
  db.saveUsers(users);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// LAPORAN
// ════════════════════════════════════════════════════════════

app.get('/api/reports/summary', (req, res) => {
  const orders          = db.getOrders();
  const completed       = orders.filter((o) => o.status === 'Selesai');
  const totalRevenue    = completed.reduce((s, o) => s + o.total, 0);
  const totalItemsSold  = completed.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);

  res.json({
    totalOrders:     orders.length,
    completedOrders: completed.length,
    totalRevenue,
    totalItemsSold,
  });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Backend Buket Bunga berjalan!' }));

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌸 Backend Buket Bunga berjalan di http://localhost:${PORT}`);
  console.log(`📁 Database: folder data/ (products.json, orders.json, users.json)`);
  console.log(`🔗 Frontend: http://localhost:5173\n`);
});
