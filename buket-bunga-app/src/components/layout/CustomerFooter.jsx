/**
 * CustomerFooter.jsx — Footer area pelanggan
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';

const CURRENT_YEAR = new Date().getFullYear();

export default function CustomerFooter() {
  return (
    <footer className="customer-footer" role="contentinfo">
      <div className="customer-footer__inner">
        {/* Kolom brand */}
        <div>
          <div className="customer-footer__brand-name">🌸 RIBINKKOCH</div>
          <p className="customer-footer__brand-desc">
            Rangkaian buket bunga segar dan istimewa untuk setiap momen spesial Anda.
          </p>
        </div>

        {/* Kolom navigasi */}
        <div>
          <div className="customer-footer__col-title">Navigasi</div>
          <nav className="customer-footer__links" aria-label="Navigasi footer">
            <Link to={ROUTES.HOME}>Beranda</Link>
            <Link to={ROUTES.CATALOG}>Katalog</Link>
            <Link to={ROUTES.ORDER_FORM}>Pesan Sekarang</Link>
            <Link to={ROUTES.ORDER_STATUS}>Cek Status Pesanan</Link>
            <Link to={ROUTES.CONTACT}>Kontak &amp; Bantuan</Link>
          </nav>
        </div>

        {/* Kolom kontak */}
        <div>
          <div className="customer-footer__col-title">Hubungi Kami</div>
          <div className="customer-footer__links">
            <span>📞 0812-3456-7890</span>
            <span
              title="Hubungi customer service RIBINKKOCH"
              style={{ cursor: 'pointer' }}
            >
              💬 WhatsApp: +62 812-3456-7890
            </span>
            <span>🕐 Setiap Hari (08.00 - 20.00 WIB)</span>
          </div>
        </div>
      </div>

      <div className="customer-footer__bottom">
        <span>© {CURRENT_YEAR} RIBINKKOCH. Seluruh hak dilindungi.</span>
        <span className="badge-demo" role="note">🌸 Florist &amp; Bouquet Specialist</span>
      </div>
    </footer>
  );
}
