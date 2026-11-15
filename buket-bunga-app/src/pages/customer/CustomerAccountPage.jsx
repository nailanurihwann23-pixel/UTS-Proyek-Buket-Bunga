/**
 * CustomerAccountPage.jsx — Halaman Akun & Riwayat Pesanan Pelanggan
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import { getOrdersByCustomer } from '../../services/mockService.js';
import { ROUTES } from '../../app/routes.jsx';
import { formatRupiah } from '../../utils/currency.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { changePassword } from '../../services/mockService.js';



  export default function CustomerAccountPage() {
  const { user, isAdmin, logout, loading } = useAuth();
  // Password change state
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMessage, setPwdMessage] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdMessage({ type: 'error', text: 'Semua kolom harus diisi.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMessage({ type: 'error', text: 'Kata sandi baru tidak cocok.' });
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword(user.username, oldPwd, newPwd);
      setPwdMessage({ type: 'success', text: 'Kata sandi berhasil diubah.' });
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err) {
      setPwdMessage({ type: 'error', text: err.message });
    } finally {
      setPwdLoading(false);
    }
  };

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchMyOrders() {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const data = await getOrdersByCustomer(user.phone || user.id);
        if (isMounted) setOrders(data);
      } catch (err) {
        console.error('Gagal mengambil riwayat pesanan:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }

    fetchMyOrders();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner label="Memeriksa akun..." />
      </div>
    );
  }

  // Jika belum login, arahkan ke login pelanggan
  if (!user) {
    return <Navigate to={ROUTES.CUSTOMER_LOGIN} replace />;
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Selesai':
        return 'badge-success';
      case 'Diproses':
        return 'badge-warning';
      case 'Dibatalkan':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      {/* Banner Khusus Admin jika akun admin membuka halaman ini */}
      {isAdmin && (
        <div
          style={{
            background: 'var(--color-yellow-soft)',
            border: '1px solid var(--color-yellow-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>Anda sedang login dengan Akun Admin.</strong>
            <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, color: 'var(--color-text-secondary)' }}>
              Anda memiliki hak akses penuh ke panel pengelolaan toko.
            </p>
          </div>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="btn btn-primary btn-sm">
            Buka Panel Admin
          </Link>
        </div>
      )}

      {/* Profil Header Card */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6) var(--space-8)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-pink-soft)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-pink-primary), #fb7185)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              color: 'white',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isAdmin ? '🛡️' : '👤'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>{user.name}</h1>
              <span
                className={`badge ${isAdmin ? 'badge-warning' : 'badge-primary'}`}
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                {isAdmin ? 'Admin Toko' : 'Pelanggan'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              @{user.username} &bull; {user.phone || 'Nomor HP belum diisi'}
            </p>
            {user.address && (
              <p style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                📍 {user.address}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to={ROUTES.ORDER_FORM} className="btn btn-primary btn-sm">
            🌸 Pesan Buket Baru
          </Link>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            🚪 Keluar
          </button>
{/* UI Ubah Kata Sandi */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
  <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Ubah Kata Sandi</h3>
  <input type="password" placeholder="Kata sandi lama" value={oldPwd} onChange={e => setOldPwd(e.target.value)} style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
  <input type="password" placeholder="Kata sandi baru" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
  <input type="password" placeholder="Konfirmasi kata sandi baru" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
  <button onClick={handleChangePassword} disabled={pwdLoading} className="btn btn-primary btn-sm">
    {pwdLoading ? 'Menyimpan...' : 'Ubah Kata Sandi'}
  </button>
  {pwdMessage && (
    <p style={{ color: pwdMessage.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)', marginTop: 'var(--space-2)' }}>{pwdMessage.text}</p>
  )}
</div>
        </div>
      </div>

      {/* Riwayat Pesanan Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Riwayat Pesanan Saya</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {orders.length} pesanan ditemukan
          </span>
        </div>

        {loadingOrders ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <LoadingSpinner label="Memuat riwayat pesanan..." />
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-12) var(--space-4)',
              textAlign: 'center',
              border: '1px dashed var(--color-border)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>💐</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
              Belum ada riwayat pesanan
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', maxWidth: '400px', margin: '0 auto var(--space-4)' }}>
              Pilihlah buket bunga favorit Anda untuk membuat momen spesial semakin berkesan!
            </p>
            <Link to={ROUTES.CATALOG} className="btn btn-primary">
              Jelajahi Katalog Buket
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: 'var(--space-3)',
                    marginBottom: 'var(--space-3)',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>
                      {order.id}
                    </strong>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-3)' }}>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--font-size-sm)',
                        padding: 'var(--space-1) 0',
                      }}
                    >
                      <span>
                        🌸 {item.productNameSnapshot}{' '}
                        <strong style={{ color: 'var(--color-text-secondary)' }}>x{item.quantity}</strong>
                      </span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px dashed var(--color-border)',
                    paddingTop: 'var(--space-3)',
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Total Pembayaran:
                  </span>
                  <strong style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-pink-primary)' }}>
                    {formatRupiah(order.total)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
