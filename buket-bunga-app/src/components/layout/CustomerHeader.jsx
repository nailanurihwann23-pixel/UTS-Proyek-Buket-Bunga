/**
 * CustomerHeader.jsx — Header area pelanggan
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import { useAuth } from '../../context/useAuth.js';
import { useCart } from '../../context/useCart.js';

const NAV_LINKS = [
  { to: ROUTES.HOME,         label: 'Beranda'   },
  { to: ROUTES.CATALOG,      label: 'Katalog'   },
  { to: ROUTES.ORDER_STATUS, label: 'Status Pesanan' },
  { to: ROUTES.CONTACT,      label: 'Kontak'    },
];

export default function CustomerHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="customer-header">
      <div className="customer-header__inner">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="customer-header__brand" aria-label="Kembali ke Beranda">
          <span className="customer-header__brand-icon" aria-hidden="true">🌸</span>
          <span className="customer-header__brand-name">RIBINKKOCH</span>
        </Link>

        {/* Desktop nav */}
        <nav className="customer-header__nav" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                'customer-header__nav-link' + (isActive ? ' active' : '')
              }
              end={link.to === ROUTES.HOME}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="customer-header__cta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {isAdmin ? (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  ⚙️ Admin Panel
                </Link>
              ) : (
                <Link
                  to={ROUTES.CUSTOMER_ACCOUNT}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  👤 {user.name ? user.name.split(' ')[0] : 'Akun'}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  padding: '6px 10px',
                }}
                title="Keluar Akun"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              to={ROUTES.CUSTOMER_LOGIN}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              🔑 Masuk
            </Link>
          )}

          {/* Tombol Keranjang */}
          <Link
            to={ROUTES.CART}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
            }}
            aria-label={`Keranjang belanja, ${totalItems} buket`}
          >
            <span>🛒</span>
            <span style={{ fontWeight: 600 }}>Keranjang</span>
            {totalItems > 0 && (
              <span
                style={{
                  background: 'var(--color-pink-primary)',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  lineHeight: '1.2',
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          <Link to={ROUTES.ORDER_FORM} className="btn btn-primary btn-sm">
            Pesan Sekarang
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="customer-header__menu-btn"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        className={`customer-header__mobile-nav ${mobileOpen ? 'open' : ''}`}
        aria-label="Navigasi mobile"
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              'customer-header__nav-link' + (isActive ? ' active' : '')
            }
            end={link.to === ROUTES.HOME}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}

        <div style={{ borderTop: '1px solid var(--color-border)', margin: 'var(--space-2) 0', paddingTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {user ? (
            <>
              {isAdmin ? (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  ⚙️ Admin Panel
                </Link>
              ) : (
                <Link
                  to={ROUTES.CUSTOMER_ACCOUNT}
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  👤 Akun Saya ({user.name})
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="btn btn-sm"
                style={{ textAlign: 'center', border: '1px solid var(--color-border)' }}
              >
                Keluar
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.CUSTOMER_LOGIN}
              className="btn btn-secondary btn-sm"
              onClick={() => setMobileOpen(false)}
            >
              🔑 Masuk Akun
            </Link>
          )}

          <Link
            to={ROUTES.CART}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => setMobileOpen(false)}
          >
            🛒 Keranjang Belanja ({totalItems} buket)
          </Link>

          <Link
            to={ROUTES.ORDER_FORM}
            className="btn btn-primary btn-sm"
            onClick={() => setMobileOpen(false)}
          >
            Pesan Sekarang
          </Link>
        </div>
      </nav>
    </header>
  );
}
