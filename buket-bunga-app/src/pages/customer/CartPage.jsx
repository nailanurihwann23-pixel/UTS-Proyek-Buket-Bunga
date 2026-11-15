/**
 * CartPage.jsx — Halaman Keranjang Belanja Pelanggan
 * Sistem Informasi Buket Bunga — RIBINKKOCH
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/useCart.js';
import { formatRupiah } from '../../utils/currency.js';
import { ROUTES, buildPath } from '../../app/routes.jsx';

const CATEGORY_EMOJI = {
  Mawar: '🌹',
  Tulip: '🌷',
  Matahari: '🌻',
  Mix: '💐',
  'Baby Breath': '🌾',
  Peony: '🌸',
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: 'var(--space-10) var(--space-4)', maxWidth: '1080px' }}>
      {/* Header Halaman */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-1)' }}>
          🛒 Keranjang Belanja
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Kelola buket bunga pilihan Anda sebelum melanjutkan ke formulir pemesanan
        </p>
      </div>

      {items.length === 0 ? (
        /* Keranjang Kosong */
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-16) var(--space-4)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">
            🧺
          </div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
            Keranjang Belanja Masih Kosong
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              maxWidth: '460px',
              margin: '0 auto var(--space-6)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Anda belum menambahkan buket bunga ke dalam keranjang. Silakan jelajahi katalog kami untuk memilih rangkaian bunga yang memikat!
          </p>
          <Link to={ROUTES.CATALOG} className="btn btn-primary btn-lg">
            🌸 Jelajahi Katalog Buket
          </Link>
        </div>
      ) : (
        /* Keranjang Terisi */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
              
              {/* Daftar Item Keranjang */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                    {totalItems} Buket Dipilih ({items.length} Macam)
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}
                  >
                    🗑️ Kosongkan Keranjang
                  </button>
                </div>

                {items.map(({ product, quantity }) => {
                  const emoji = CATEGORY_EMOJI[product.category] || '💐';
                  const itemSubtotal = product.price * quantity;
                  const isMaxStock = quantity >= product.stock;

                  return (
                    <div
                      key={product.id}
                      style={{
                        background: 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-5)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-border)',
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr auto',
                        gap: 'var(--space-4)',
                        alignItems: 'center',
                      }}
                    >
                      {/* Visual Icon / Emoji */}
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-pink-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2.2rem',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          emoji
                        )}
                      </div>

                      {/* Info Buket */}
                      <div>
                        <Link
                          to={buildPath(ROUTES.PRODUCT_DETAIL, { productId: product.id })}
                          style={{
                            fontWeight: 600,
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text-primary)',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          {product.name}
                        </Link>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                          Kategori: {product.category} &bull; Harga: {formatRupiah(product.price)}
                        </div>

                        {/* Pengatur Kuantitas */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="btn btn-secondary btn-sm"
                            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            aria-label="Kurangi jumlah"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => updateQuantity(product.id, e.target.value)}
                            style={{
                              width: '48px',
                              height: '28px',
                              textAlign: 'center',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 600,
                            }}
                            aria-label={`Jumlah pesanan untuk ${product.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="btn btn-secondary btn-sm"
                            disabled={isMaxStock}
                            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            aria-label="Tambah jumlah"
                          >
                            +
                          </button>

                          {isMaxStock && (
                            <span style={{ fontSize: '11px', color: '#dc2626', marginLeft: '4px' }}>
                              Maks. stok
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtotal & Tombol Hapus */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-pink-primary)' }}>
                          {formatRupiah(itemSubtotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: 'var(--font-size-xs)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px',
                          }}
                          aria-label={`Hapus ${product.name} dari keranjang`}
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ringkasan Belanja & Checkout Card */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-pink-soft)',
                  position: 'sticky',
                  top: '100px',
                }}
              >
                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                  Ringkasan Pesanan
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Total Macam Produk:</span>
                    <strong>{items.length} jenis</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Total Jumlah Buket:</span>
                    <strong>{totalItems} buket</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 'var(--space-3)',
                      borderTop: '1px dashed var(--color-border)',
                      fontSize: 'var(--font-size-base)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Total Pembayaran:</span>
                    <strong style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-pink-primary)' }}>
                      {formatRupiah(totalPrice)}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.ORDER_FORM)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: 'var(--font-size-base)' }}
                  >
                    🛍️ Lanjut ke Pemesanan (Checkout)
                  </button>
                  <Link
                    to={ROUTES.CATALOG}
                    className="btn btn-secondary"
                    style={{ width: '100%', textAlign: 'center', fontSize: 'var(--font-size-sm)' }}
                  >
                    🌸 Tambah Buket Lain
                  </Link>
                </div>

                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  ℹ️ <strong>Buket Segar RIBINKKOCH</strong> dirangkai dengan teliti dan penuh dedikasi sesaat sebelum dikirimkan ke alamat Anda.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
