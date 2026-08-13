import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { lazy, Suspense } from "react";

// =========================================
// AUTH / ROUTE PROTECTION
// =========================================

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Auth/AdminRoute";

// =========================================
// LAYOUTS
// =========================================

import DashboardLayout from "./components/Layout/DashboardLayout";
import UserLayout from "./components/UserLayout/UserLayout";
import PageLoader from "./components/PageLoader/PageLoader";

// =========================================
// LAZY LOADING
// =========================================

const Login = lazy(() => import("./pages/Login/Login"));

const Signup = lazy(() => import("./pages/Signup/Signup"));

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

// =========================================
// ADMIN ORDERS
// =========================================

const AdminOrders = lazy(() => import("./pages/AdminOrders/AdminOrders"));
// =========================================
// ADMIN Setting
// =========================================
const Settings = lazy(() => import("./pages/Settings/Settings"));

// =========================================
// ADMIN CUSTOMERS
// =========================================

const Customers = lazy(() => import("./pages/Customers/Customers"));

// =========================================
// USER ORDERS
// =========================================

const Orders = lazy(() => import("./pages/Orders/Orders"));

// =========================================
// USER / PRODUCT PAGES
// =========================================

const Home = lazy(() => import("./pages/Home/Home"));

const Fruits = lazy(() => import("./pages/Fruits/Fruits"));

const Vegetables = lazy(() => import("./pages/Vegetables/Vegetables"));

const Groceries = lazy(() => import("./pages/Groceries/Groceries"));

const Offers = lazy(() => import("./pages/Offers/Offers"));

const Cart = lazy(() => import("./pages/Cart/Cart"));

// =========================================
// CHECKOUT
// =========================================

const Checkout = lazy(() => import("./pages/Checkout/Checkout"));

// =========================================
// OTHER PAGES
// =========================================

const About = lazy(() => import("./pages/About/About"));

const Menu = lazy(() => import("./pages/Menu/Menu"));

const Contact = lazy(() => import("./pages/Contact/Contact"));

// =========================================
// APP
// =========================================

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* =================================
                LOGIN
          ================================= */}

          <Route path="/login" element={<Login />} />

          {/* =================================
                SIGNUP
          ================================= */}

          <Route path="/signup" element={<Signup />} />

          {/* =================================
                ADMIN
          ================================= */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            {/* =================================
                  ADMIN DASHBOARD
            ================================= */}

            <Route index element={<Dashboard />} />

            {/* =================================
                  ADMIN FRUITS
            ================================= */}

            <Route path="fruits" element={<Fruits />} />

            {/* =================================
                  ADMIN VEGETABLES
            ================================= */}

            <Route path="vegetables" element={<Vegetables />} />

            {/* =================================
                  ADMIN GROCERIES
            ================================= */}

            <Route path="groceries" element={<Groceries />} />

            {/* =================================
                  ADMIN OFFERS
            ================================= */}

            <Route path="offers" element={<Offers />} />

            {/* =================================
                  ADMIN ORDERS
            ================================= */}

            <Route path="orders" element={<AdminOrders />} />

            {/* =================================
                  ADMIN CUSTOMERS
            ================================= */}

            <Route path="customers" element={<Customers />} />
            {/* =================================
                  ADMIN Setting
            ================================= */}

            <Route path="settings" element={<Settings />} />
          </Route>

          {/* =================================
                USER
          ================================= */}

          <Route
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            {/* =================================
                  HOME
            ================================= */}

            <Route index element={<Home />} />

            {/* =================================
                  ABOUT
            ================================= */}

            <Route path="about" element={<About />} />

            {/* =================================
                  MENU
            ================================= */}

            <Route path="menu" element={<Menu />} />

            {/* =================================
                  CONTACT
            ================================= */}

            <Route path="contact" element={<Contact />} />

            {/* =================================
                  PRODUCT PAGES
            ================================= */}

            <Route path="fruits" element={<Fruits />} />

            <Route path="vegetables" element={<Vegetables />} />

            <Route path="groceries" element={<Groceries />} />

            <Route path="offers" element={<Offers />} />

            {/* =================================
                  CART
            ================================= */}

            <Route path="cart" element={<Cart />} />

            {/* =================================
                  CHECKOUT
            ================================= */}

            <Route path="checkout" element={<Checkout />} />

            {/* =================================
                  MY ORDERS
            ================================= */}

            <Route path="orders" element={<Orders />} />
          </Route>

          {/* =================================
                FALLBACK
          ================================= */}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
