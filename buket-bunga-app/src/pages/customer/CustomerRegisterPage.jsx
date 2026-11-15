/**
 * CustomerRegisterPage.jsx — Halaman Registrasi Pelanggan Baru
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

export default function CustomerRegisterPage() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Jika sudah login, redirect ke halaman asal atau akun
  if (!loading && user) {
    const from = (location.state?.from?.pathname ?? ROUTES.CUSTOMER_ACCOUNT) + (location.state?.from?.search ?? '');
    return <Navigate to={from} replace />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner label="Memeriksa sesi..." />
      </div>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!form.username.trim()) {
      setError('Username wajib diisi.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Nomor WhatsApp / HP wajib diisi.');
      return;
    }
    if (!form.password) {
      setError('Kata sandi wajib diisi.');
      return;
    }
    if (form.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      });
      const destination = (location.state?.from?.pathname ?? ROUTES.CUSTOMER_ACCOUNT) + (location.state?.from?.search ?? '');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Registrasi gagal. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        padding: 'var(--space-10) var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-8)',
          width: '100%',
          maxWidth: '480px',
          border: '1px solid var(--color-pink-soft)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🌸</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-pink-primary)', marginBottom: 'var(--space-1)' }}>
            Daftar Akun di RIBINKKOCH
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Daftar akun sekarang untuk kemudahan memesan buket bunga dan memantau status pesanan Anda
          </p>
        </div>

        {/* Pesan Wajib Daftar/Login */}
        {location.state?.message && (
          <div
            role="alert"
            style={{
              background: '#fdf2f8',
              border: '1px solid var(--color-pink-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-5)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-pink-dark)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-2)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
            <div>{location.state.message}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Form registrasi pelanggan">
          <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
            <label className="form-label" htmlFor="reg-name">
              Nama Lengkap <span className="required">*</span>
            </label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Rina Melati"
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">
                Username <span className="required">*</span>
              </label>
              <input
                id="reg-username"
                className="form-input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="rinamelati"
                autoComplete="username"
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">
                No. WhatsApp/HP <span className="required">*</span>
              </label>
              <input
                id="reg-phone"
                className="form-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08123456789"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
            <label className="form-label" htmlFor="reg-email">
              Email (Opsional)
            </label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              disabled={submitting}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
            <label className="form-label" htmlFor="reg-address">
              Alamat Pengiriman (Opsional)
            </label>
            <textarea
              id="reg-address"
              className="form-input"
              name="address"
              rows={2}
              value={form.address}
              onChange={handleChange}
              placeholder="Alamat lengkap untuk memudahkan pengiriman pesanan"
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Kata Sandi <span className="required">*</span>
              </label>
              <input
                id="reg-password"
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 karakter"
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirmPassword">
                Ulangi Sandi <span className="required">*</span>
              </label>
              <input
                id="reg-confirmPassword"
                className="form-input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Sama dengan sandi"
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>
          </div>

          {error && (
            <div
              className="form-error"
              role="alert"
              style={{
                marginBottom: 'var(--space-4)',
                padding: 'var(--space-2) var(--space-3)',
                background: '#fee2e2',
                borderRadius: 'var(--radius-sm)',
                color: '#dc2626',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 'var(--space-4)' }}
            disabled={submitting}
          >
            {submitting ? 'Mendaftarkan Akun...' : 'Daftar Akun'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Sudah punya akun? </span>
          <Link
            to={ROUTES.CUSTOMER_LOGIN}
            state={location.state}
            style={{ fontWeight: 600, color: 'var(--color-pink-primary)' }}
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
