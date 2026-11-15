/**
 * App.jsx — Routing dan Provider Utama Aplikasi
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { AuthContext } from './context/authContextDef.js';
import { ROUTES } from './app/routes.jsx';

// Styles
import './styles/global.css';
import './styles/components.css';
import './styles/layout.css';
import './components/ui/ui.css';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Customer Pages
import HomePage from './pages/customer/HomePage.jsx';
import CatalogPage from './pages/customer/CatalogPage.jsx';
import ProductDetailPage from './pages/customer/ProductDetailPage.jsx';
import OrderFormPage from './pages/customer/OrderFormPage.jsx';
import OrderStatusPage from './pages/customer/OrderStatusPage.jsx';
import ContactPage from './pages/customer/ContactPage.jsx';
import CustomerLoginPage from './pages/customer/CustomerLoginPage.jsx';
import CustomerRegisterPage from './pages/customer/CustomerRegisterPage.jsx';
import CustomerAccountPage from './pages/customer/CustomerAccountPage.jsx';
import CartPage from './pages/customer/CartPage.jsx';

// Admin Pages
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import ProductListPage from './pages/admin/ProductListPage.jsx';
import ProductFormPage from './pages/admin/ProductFormPage.jsx';
import StockPage from './pages/admin/StockPage.jsx';
import OrderListPage from './pages/admin/OrderListPage.jsx';
import ReportPage from './pages/admin/ReportPage.jsx';

// 404 Page
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Simple component that decides which layout to show for the root path.
 * If the logged‑in user is an admin we redirect straight to the admin dashboard.
 * Otherwise we render the normal CustomerLayout (which contains an <Outlet/> for
 * the nested customer routes).
 */
function RootRedirect() {
  // Default: tampilkan toko (CustomerLayout) sebagai beranda.
  return <CustomerLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
        <BrowserRouter>
          <Routes>
            {/* Root path – chooses layout based on role */}
            <Route path="/" element={<RootRedirect />}>
              {/* Customer nested routes */}
              <Route index element={<HomePage />} />
              <Route path="katalog" element={<CatalogPage />} />
              <Route path="katalog/:productId" element={<ProductDetailPage />} />
              <Route path="pesan" element={<OrderFormPage />} />
              <Route path="status-pesanan" element={<OrderStatusPage />} />
              <Route path="kontak" element={<ContactPage />} />
              <Route path="login" element={<CustomerLoginPage />} />
              <Route path="register" element={<CustomerRegisterPage />} />
              <Route path="akun" element={<CustomerAccountPage />} />
              <Route path="keranjang" element={<CartPage />} />
            </Route>

            {/* Public admin login page */}
            <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />

            {/* Protected admin area */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="produk" element={<ProductListPage />} />
              <Route path="produk/tambah" element={<ProductFormPage />} />
              <Route path="produk/:productId/edit" element={<ProductFormPage />} />
              <Route path="stok" element={<StockPage />} />
              <Route path="pesanan" element={<OrderListPage />} />
              <Route path="pesanan/:orderId" element={<OrderListPage />} />
              <Route path="laporan" element={<ReportPage />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
