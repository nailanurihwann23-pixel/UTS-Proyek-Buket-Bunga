/**
 * mockUsers.js — Data mock pengguna (Admin & Pelanggan)
 *
 * ⚠️ DEMO DATA — Bukan keamanan produksi.
 * Sistem Informasi Buket Bunga
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

export const MOCK_USERS = [
  {
    id: 'user-admin-01',
    username: 'admin',
    password: 'demo1234',
    name: 'Administrator Toko',
    role: USER_ROLES.ADMIN,
    email: 'admin@buketbunga.com',
    phone: '081299998888',
    address: 'Kantor Pusat Florist, Jakarta',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-cust-01',
    username: 'user',
    password: 'user123',
    name: 'Siti Anggraini',
    role: USER_ROLES.CUSTOMER,
    email: 'siti@gmail.com',
    phone: '081200000001',
    address: 'Jl. Mawar Melati No. 15, Jakarta Barat',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'user-cust-02',
    username: 'budi',
    password: 'user123',
    name: 'Budi Santoso',
    role: USER_ROLES.CUSTOMER,
    email: 'budi@gmail.com',
    phone: '081200000002',
    address: 'Jl. Dahlia No. 4, Bandung',
    createdAt: '2026-09-10T00:00:00.000Z',
  },
];
