import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import { CustomerShell } from "../components/layout/CustomerLayout.jsx";
import BannerManagement from "../pages/admin/BannerManagement.jsx";
import CategoryManagement from "../pages/admin/CategoryManagement.jsx";
import CustomerManagement from "../pages/admin/CustomerManagement.jsx";
import InventoryManagement from "../pages/admin/InventoryManagement.jsx";
import OrderManagement from "../pages/admin/OrderManagement.jsx";
import ProductManagement from "../pages/admin/ProductManagement.jsx";
import ReviewManagement from "../pages/admin/ReviewManagement.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
import OrderHistory from "../pages/customer/OrderHistory.jsx";
import Profile from "../pages/customer/Profile.jsx";
import SavedAddresses from "../pages/customer/SavedAddresses.jsx";
import Wishlist from "../pages/customer/Wishlist.jsx";
import About from "../pages/public/About.jsx";
import BestSellers from "../pages/public/BestSellers.jsx";
import Cart from "../pages/public/Cart.jsx";
import Categories from "../pages/public/Categories.jsx";
import CategoryRedirect from "../pages/public/CategoryRedirect.jsx";
import Checkout from "../pages/public/Checkout.jsx";
import Contact from "../pages/public/Contact.jsx";
import FAQ from "../pages/public/FAQ.jsx";
import Home from "../pages/public/Home.jsx";
import Login from "../pages/public/Login.jsx";
import NewArrivals from "../pages/public/NewArrivals.jsx";
import NotFound from "../pages/public/NotFound.jsx";
import OrderSuccess from "../pages/public/OrderSuccess.jsx";
import ProductDetail from "../pages/public/ProductDetail.jsx";
import Register from "../pages/public/Register.jsx";
import Shop from "../pages/public/Shop.jsx";
import Testimonials from "../pages/public/Testimonials.jsx";
import AdminRoute from "./AdminRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const Analytics = lazy(() => import("../pages/admin/Analytics.jsx"));

function lazyPage(Component) {
  return (
    <Suspense fallback={<div className="admin-card text-sm font-bold text-muted">Loading page...</div>}>
      <Component />
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<CategoryRedirect />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="best-sellers" element={<BestSellers />} />
        <Route path="about" element={<About />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="account" element={<CustomerShell />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<SavedAddresses />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={lazyPage(AdminDashboard)} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="analytics" element={lazyPage(Analytics)} />
        </Route>
      </Route>
    </Routes>
  );
}
