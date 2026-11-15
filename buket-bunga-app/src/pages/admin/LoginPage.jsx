/**
 * LoginPage.jsx — Halaman login admin (demo)
 *
 * ⚠️  DEMO ONLY — Bukan autentikasi produksi.
 * Kredensial demo: admin / demo1234
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

export default function LoginPage() {
  const { loginAsAdmin, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Jika sudah login, redirect ke dashboard
  if (!loading && isAdmin) {
    const from = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
    return <Navigate to={from} replace />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner label="Memeriksa sesi..." />
      </div>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleDemoLogin() {
    try {
      await loginAsAdmin('admin', 'demo1234');
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Login demo gagal.');
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Identitas dan kata sandi wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await loginAsAdmin(form.username.trim(), form.password);
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Login gagal. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
        padding: 'var(--space-6)',
      }}
    >
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-10)',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">🌸</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-1)' }}>
            Panel Admin
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Sistem Informasi Buket Bunga
          </p>
        </div>

        {/* Demo warning */}
        <div
          role="note"
          style={{
            background: 'var(--color-yellow-soft)',
            border: '1px solid var(--color-yellow-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-warning)',
          }}
        >
          🔐 <strong>Kredensial Admin Demo:</strong><br />
          Username: <code>admin</code> | Password: <code>demo1234</code>
        </div>

        {/* Demo login button */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <button className="btn btn-primary btn-lg" onClick={handleDemoLogin} disabled={submitting}>
            {submitting ? '⏳ Masuk...' : '🔐 Login langsung (Admin)'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Form login admin">
          <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="form-label" htmlFor="login-username">
              Nama Pengguna <span className="required" aria-label="wajib">*</span>
            </label>
            <input
              id="login-username"
              className={`form-input ${error ? 'error' : ''}`}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan nama pengguna"
              autoComplete="username"
              disabled={submitting}
              aria-describedby={error ? 'login-error' : undefined}
              aria-required="true"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label className="form-label" htmlFor="login-password">
              Kata Sandi <span className="required" aria-label="wajib">*</span>
            </label>
            <input
              id="login-password"
              className={`form-input ${error ? 'error' : ''}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              disabled={submitting}
              aria-describedby={error ? 'login-error' : undefined}
              aria-required="true"
            />
          </div>

          {error && (
            <div
              id="login-error"
              className="form-error"
              role="alert"
              aria-live="assertive"
              style={{ marginBottom: 'var(--space-4)' }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 'var(--space-4)' }}
            disabled={submitting}
          >
            {submitting ? '⏳ Masuk...' : '🔐 Masuk sebagai Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Link to={ROUTES.HOME} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-pink-primary)' }}>
            &larr; Kembali ke Beranda Toko
          </Link>
          <Link to={ROUTES.CUSTOMER_LOGIN} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Bukan Admin? Masuk sebagai Pelanggan
          </Link>
        </div>
      </div>
    </div>
  );
}
