/**
 * ProductDetailPage.jsx — Halaman Rincian Detail Produk Buket
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext.jsx';
import { formatRupiah } from '../../utils/currency.js';
import { ROUTES } from '../../app/routes.jsx';
import { useCart } from '../../context/useCart.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

const CATEGORY_EMOJI = {
  Mawar: '🌹',
  Tulip: '🌷',
  Matahari: '🌻',
  Mix: '💐',
  'Baby Breath': '🌾',
  Peony: '🌸',
};

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === productId) ?? null;
  const loading = productsLoading && !product;
  const error = !productsLoading && !product ? 'Produk tidak ditemukan.' : null;

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
        <LoadingSpinner label="Memuat informasi detail buket..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
        <ErrorState
          title="Produk Tidak Ditemukan"
          message={error || 'Produk yang Anda cari tidak tersedia dalam katalog kami.'}
        />
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link to={ROUTES.CATALOG} className="btn btn-secondary">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const emoji = CATEGORY_EMOJI[product.category] || '💐';

  return (
    <div className="container" style={{ padding: 'var(--space-10) var(--space-4)' }}>
      {/* Breadcrumb & tombol kembali */}
      <nav aria-label="Navigasi kembali" style={{ marginBottom: 'var(--space-6)' }}>
        <Link to={ROUTES.CATALOG} className="btn btn-ghost btn-sm">
          ← Kembali ke Katalog
        </Link>
      </nav>

      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-8)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {/* Kolom Gambar/Visual */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
            borderRadius: 'var(--radius-lg)',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: product.image ? 0 : 'var(--space-6)',
            overflow: 'hidden',
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', minHeight: '340px', maxHeight: '450px', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <>
              <div style={{ fontSize: '6rem', marginBottom: 'var(--space-3)', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.08))' }} aria-hidden="true">
                {emoji}
              </div>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  padding: '4px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Kategori: {product.category}
              </span>
            </>
          )}
        </div>

        {/* Kolom Informasi & Aksi */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-pink-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {product.category}
            </span>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
              {product.name}
            </h1>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-pink-primary)' }}>
              {formatRupiah(product.price)}
            </div>
          </div>

          {/* Status Stok */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Ketersediaan:
            </span>
            {isOutOfStock ? (
              <span className="badge badge-danger">Stok Habis</span>
            ) : isLowStock ? (
              <span className="badge badge-warning">Stok Menipis (Tersisa {product.stock})</span>
            ) : (
              <span className="badge badge-success">Tersedia ({product.stock} buket)</span>
            )}
          </div>

          {/* Deskripsi Lengkap */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
              Deskripsi Buket
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)' }}>
              {product.description}
            </p>
          </div>

          {/* Poin Layanan Tambahan */}
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div>✨ <strong>Bunga Segar:</strong> Dipetik langsung dan dirangkai pada hari pengiriman.</div>
            <div>💌 <strong>Kartu Ucapan:</strong> Tersedia kartu ucapan khusus tanpa biaya tambahan.</div>
            <div>🎀 <strong>Packaging:</strong> Pembungkus kertas cellophane premium dengan pita satin.</div>
          </div>

          {/* Pengatur Kuantitas & Tombol CTA Pesan */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Jumlah:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    aria-label="Kurangi jumlah"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setQuantity(Math.max(1, Math.min(product.stock, val)));
                    }}
                    style={{
                      width: '54px',
                      height: '32px',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontWeight: 600,
                    }}
                    aria-label="Jumlah pesanan"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="btn btn-secondary btn-sm"
                    disabled={quantity >= product.stock}
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  Total: <strong style={{ color: 'var(--color-pink-primary)' }}>{formatRupiah(product.price * quantity)}</strong>
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {isOutOfStock ? (
                <button className="btn btn-secondary" disabled style={{ flex: 1 }}>
                  Produk Sedang Habis
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => addToCart(product, quantity)}
                    className="btn btn-secondary btn-lg"
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    🛒 + Keranjang
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, quantity);
                      navigate(ROUTES.ORDER_FORM);
                    }}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, textAlign: 'center' }}
                    id="btn-pesan-buket-ini"
                  >
                    🌸 Beli Sekarang
                  </button>
                </>
              )}
              <Link to={ROUTES.CONTACT} className="btn btn-ghost">
                Tanya Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
