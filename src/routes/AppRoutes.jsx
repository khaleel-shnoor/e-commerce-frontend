import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import SearchPage from '../pages/SearchPage';
import ContentPage from '../pages/ContentPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OtpPage from '../pages/auth/OtpPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

import CustomerDashboard from '../dashboard/CustomerDashboard';
import CustomerOrders from '../dashboard/CustomerOrders';
import CustomerOrderDetails from '../dashboard/CustomerOrderDetails';
import CustomerWishlist from '../dashboard/CustomerWishlist';
import CustomerCart from '../dashboard/CustomerCart';
import CustomerCheckout from '../dashboard/CustomerCheckout';
import PaymentSuccess from '../dashboard/PaymentSuccess';
import PaymentFailed from '../dashboard/PaymentFailed';
import CustomerAddresses from '../dashboard/CustomerAddresses';
import CustomerNotifications from '../dashboard/CustomerNotifications';
import CustomerCoupons from '../dashboard/CustomerCoupons';
import CustomerReviews from '../dashboard/CustomerReviews';
import CustomerSettings from '../dashboard/CustomerSettings';
import CustomerProfile from '../dashboard/CustomerProfile';

import SellerDashboard from '../business/SellerDashboard';
import SellerAnalytics from '../business/SellerAnalytics';
import SellerOrders from '../business/SellerOrders';
import SellerProducts from '../business/SellerProducts';
import SellerAddProduct from '../business/SellerAddProduct';
import SellerEditProduct from '../business/SellerEditProduct';
import SellerInventory from '../business/SellerInventory';
import SellerReviews from '../business/SellerReviews';
import SellerCoupons from '../business/SellerCoupons';
import SellerStore from '../business/SellerStore';
import SellerWallet from '../business/SellerWallet';
import SellerTransactions from '../business/SellerTransactions';
import SellerShipping from '../business/SellerShipping';
import SellerNotifications from '../business/SellerNotifications';
import SellerProfile from '../business/SellerProfile';
import SellerSettings from '../business/SellerSettings';

import AdminDashboard from '../admin/AdminDashboard';
import AdminUsers from '../admin/AdminUsers';
import AdminSellers from '../admin/AdminSellers';
import AdminProducts from '../admin/AdminProducts';
import AdminOrders from '../admin/AdminOrders';
import AdminTransactions from '../admin/AdminTransactions';
import AdminAnalytics from '../admin/AdminAnalytics';
import AdminReports from '../admin/AdminReports';
import AdminCategories from '../admin/AdminCategories';
import AdminCoupons from '../admin/AdminCoupons';
import AdminCms from '../admin/AdminCms';
import AdminBanners from '../admin/AdminBanners';
import AdminNotifications from '../admin/AdminNotifications';
import AdminSupport from '../admin/AdminSupport';
import AdminReviews from '../admin/AdminReviews';
import AdminSettings from '../admin/AdminSettings';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="product/:slug" element={<ProductDetailsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<ContentPage type="about" />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<ContentPage type="faq" />} />
        <Route path="terms" element={<ContentPage type="terms" />} />
        <Route path="privacy" element={<ContentPage type="privacy" />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-otp" element={<OtpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="account"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orders/:id" element={<CustomerOrderDetails />} />
        <Route path="wishlist" element={<CustomerWishlist />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-failed" element={<PaymentFailed />} />
        <Route path="addresses" element={<CustomerAddresses />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="coupons" element={<CustomerCoupons />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      <Route
        path="seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/add" element={<SellerAddProduct />} />
        <Route path="products/edit/:id" element={<SellerEditProduct />} />
        <Route path="inventory" element={<SellerInventory />} />
        <Route path="reviews" element={<SellerReviews />} />
        <Route path="coupons" element={<SellerCoupons />} />
        <Route path="store" element={<SellerStore />} />
        <Route path="wallet" element={<SellerWallet />} />
        <Route path="transactions" element={<SellerTransactions />} />
        <Route path="shipping" element={<SellerShipping />} />
        <Route path="notifications" element={<SellerNotifications />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="settings" element={<SellerSettings />} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="cms" element={<AdminCms />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
