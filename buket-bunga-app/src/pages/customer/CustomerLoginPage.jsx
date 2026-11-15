/**
 * CustomerLoginPage.jsx — Halaman Login Pelanggan
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

export default function CustomerLoginPage() {
  const { loginAsCustomer, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Jika sudah login
  if (!loading && user) {
    if (isAdmin) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
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

  function handleFillDemo() {
    setForm({ username: 'user', password: 'user123' });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username/No. HP dan kata sandi wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      await loginAsCustomer(form.username.trim(), form.password);
      const destination = (location.state?.from?.pathname ?? ROUTES.CUSTOMER_ACCOUNT) + (location.state?.from?.search ?? '');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Gagal masuk. Silakan periksa kembali.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        padding: 'var(--space-12) var(--space-4)',
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
          padding: 'var(--space-8) var(--space-8)',
          width: '100%',
          maxWidth: '440px',
          border: '1px solid var(--color-pink-soft)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🌸</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-pink-primary)', marginBottom: 'var(--space-1)' }}>
            Masuk ke RIBINKKOCH
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Masuk akun untuk kemudahan pemesanan buket dan lacak pesanan Anda
          </p>
        </div>

        {/* Pesan Wajib Login (jika dialihkan dari klik Pesan) */}
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

        {/* Demo Shortcut Card */}
        <div
          style={{
            background: 'var(--color-pink-soft)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <strong>Akun Demo:</strong> <code>user</code> / <code>user123</code>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 'var(--font-size-xs)', padding: '4px 8px' }}
          >
            Gunakan Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Form login pelanggan">
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label" htmlFor="customer-username">
              Username / No. WhatsApp / Email <span className="required">*</span>
            </label>
            <input
              id="customer-username"
              className={`form-input ${error ? 'error' : ''}`}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Contoh: user atau 081234567890"
              autoComplete="username"
              disabled={submitting}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="form-label" htmlFor="customer-password">
              Kata Sandi <span className="required">*</span>
            </label>
            <input
              id="customer-password"
              className={`form-input ${error ? 'error' : ''}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              disabled={submitting}
            />
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
            {submitting ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        {/* Register Prompt */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Belum punya akun? </span>
          <Link
            to={ROUTES.CUSTOMER_REGISTER}
            state={location.state}
            style={{ fontWeight: 600, color: 'var(--color-pink-primary)' }}
          >
            Daftar di sini
          </Link>
        </div>

        {/* Divider & Admin Switch */}
        <div
          style={{
            margin: 'var(--space-6) 0 var(--space-3)',
            borderTop: '1px dashed var(--color-border)',
            textAlign: 'center',
            paddingTop: 'var(--space-3)',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Apakah Anda pengelola toko?{' '}
            <Link to={ROUTES.ADMIN_LOGIN} style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>
              Masuk ke Panel Admin
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
