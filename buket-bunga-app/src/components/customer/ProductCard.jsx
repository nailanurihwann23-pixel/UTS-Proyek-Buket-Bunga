/**
 * ProductCard.jsx — Kartu produk buket bunga untuk katalog dan beranda
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency.js';
import { ROUTES, buildPath } from '../../app/routes.jsx';
import { useCart } from '../../context/useCart.js';

/**
 * Peta emoji / visual berdasarkan kategori
 */
const CATEGORY_EMOJI = {
  Mawar: '🌹',
  Tulip: '🌷',
  Matahari: '🌻',
  Mix: '💐',
  'Baby Breath': '🌾',
  Peony: '🌸',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const emoji = CATEGORY_EMOJI[product.category] || '💐';

  return (
    <article className="card product-card" aria-labelledby={`product-title-${product.id}`}>
      {/* Gambar/Visual Ilustrasi Produk */}
      <div className="product-card__media">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.parentElement.querySelector('.product-card__placeholder');
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="product-card__placeholder"
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          <span className="product-card__emoji" aria-hidden="true">{emoji}</span>
          <span className="product-card__category-tag">{product.category}</span>
        </div>
        {/* Badge stok overlay */}
        <div className="product-card__stock-badge">
          {isOutOfStock ? (
            <span className="badge badge-danger">Habis</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">Tersisa {product.stock}</span>
          ) : (
            <span className="badge badge-success">Stok: {product.stock}</span>
          )}
        </div>
      </div>

      {/* Konten Kartu */}
      <div className="card-body product-card__body">
        <h3 id={`product-title-${product.id}`} className="product-card__title">
          {product.name}
        </h3>
        <p className="product-card__desc">
          {product.description}
        </p>

        <div className="product-card__footer">
          <div className="product-card__price-wrapper">
            <span className="product-card__price-label">Harga</span>
            <span className="product-card__price">{formatRupiah(product.price)}</span>
          </div>

          <div className="product-card__actions" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link
              to={buildPath(ROUTES.PRODUCT_DETAIL, { productId: product.id })}
              className="btn btn-ghost btn-sm"
              aria-label={`Lihat detail ${product.name}`}
            >
              Detail
            </Link>
            {isOutOfStock ? (
              <button className="btn btn-secondary btn-sm" disabled aria-disabled="true">
                Habis
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  title="Tambah ke Keranjang Belanja"
                  aria-label={`Tambah ${product.name} ke keranjang`}
                >
                  🛒 +
                </button>
                <Link
                  to={`${ROUTES.ORDER_FORM}?productId=${product.id}`}
                  className="btn btn-primary btn-sm"
                  aria-label={`Pesan ${product.name}`}
                >
                  Pesan
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
