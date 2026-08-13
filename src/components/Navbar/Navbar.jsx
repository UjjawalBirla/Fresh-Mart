import { useEffect, useState } from "react";

import {
  FiSearch,
  FiBell,
  FiUser,
  FiMenu,
  FiShoppingCart,
  FiSun,
  FiMoon,
  FiAlertTriangle,
  FiPackage,
  FiX,
} from "react-icons/fi";

import { useTheme } from "../../contexts/ThemeContext";

import { Link } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import "./Navbar.css";

function Navbar({ openSidebar }) {
  // =========================================
  // STATES
  // =========================================

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);

  const [notificationLoading, setNotificationLoading] = useState(false);

  // =========================================
  // CONTEXTS
  // =========================================

  const { cartCount } = useCart();

  const { theme, toggleTheme } = useTheme();

  // =========================================
  // FETCH OUT OF STOCK PRODUCTS
  // =========================================

  const fetchOutOfStockProducts = async () => {
    try {
      setNotificationLoading(true);

      const productsRef = collection(db, "products");

      const snapshot = await getDocs(productsRef);

      const products = snapshot.docs
        .map((productDoc) => {
          const data = productDoc.data();

          return {
            id: productDoc.id,

            name: data.name || data.title || "Unnamed Product",

            stock: Number(data.stock ?? 0),

            category: data.category || "Product",

            image: data.image || data.imageUrl || "",
          };
        })
        .filter((product) => product.stock <= 0);

      setOutOfStockProducts(products);
    } catch (error) {
      console.error("Notification products error:", error);

      setOutOfStockProducts([]);
    } finally {
      setNotificationLoading(false);
    }
  };

  // =========================================
  // LOAD STOCK DATA
  // =========================================

  useEffect(() => {
    fetchOutOfStockProducts();

    const interval = setInterval(() => {
      fetchOutOfStockProducts();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================================
  // NOTIFICATION TOGGLE
  // =========================================

  const toggleNotifications = async () => {
    const newState = !notificationOpen;

    setNotificationOpen(newState);

    if (newState) {
      await fetchOutOfStockProducts();
    }
  };

  // =========================================
  // CLOSE NOTIFICATION
  // =========================================

  const closeNotifications = () => {
    setNotificationOpen(false);
  };

  return (
    <header className="navbar">
      {/* =================================
          LEFT
      ================================= */}

      <div className="navbar-left">
        {/* MOBILE MENU */}

        <button
          type="button"
          className="navbar-menu-btn"
          onClick={openSidebar}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>

        {/* SEARCH */}

        <div className="navbar-search">
          <FiSearch />

          <input type="text" placeholder="Search products..." />
        </div>
      </div>

      {/* =================================
          RIGHT
      ================================= */}

      <div className="navbar-right">
        {/* CART */}

        {/* <Link to="/cart" className="navbar-cart" aria-label="Shopping cart">
          <FiShoppingCart />

          {cartCount > 0 && (
            <span className="navbar-cart-count">{cartCount}</span>
          )}
        </Link> */}

        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <div className="navbar-notification-wrapper">
          <button
            type="button"
            className="navbar-icon"
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <FiBell />

            {outOfStockProducts.length > 0 && (
              <span className="notification-dot">
                {outOfStockProducts.length > 99
                  ? "99+"
                  : outOfStockProducts.length}
              </span>
            )}
          </button>

          {/* =================================
              NOTIFICATION DROPDOWN
          ================================= */}

          {notificationOpen && (
            <div className="notification-dropdown">
              {/* HEADER */}

              <div className="notification-header">
                <div>
                  <strong>Notifications</strong>

                  <span>Inventory alerts</span>
                </div>

                <button
                  type="button"
                  onClick={closeNotifications}
                  aria-label="Close notifications"
                >
                  <FiX />
                </button>
              </div>

              {/* =================================
                  LOADING
              ================================= */}

              {notificationLoading ? (
                <div className="notification-loading">
                  <div className="notification-spinner"></div>

                  <span>Checking inventory...</span>
                </div>
              ) : outOfStockProducts.length === 0 ? (
                /* =================================
                    NO ALERTS
                ================================= */

                <div className="notification-empty">
                  <div className="notification-empty-icon">
                    <FiPackage />
                  </div>

                  <strong>All products are in stock</strong>

                  <span>No inventory alerts right now.</span>
                </div>
              ) : (
                /* =================================
                    OUT OF STOCK LIST
                ================================= */

                <div className="notification-list">
                  <div className="notification-alert-title">
                    <FiAlertTriangle />

                    <span>
                      {outOfStockProducts.length} product
                      {outOfStockProducts.length !== 1 ? "s" : ""} out of stock
                    </span>
                  </div>

                  {outOfStockProducts.map((product) => (
                    <div className="notification-item" key={product.id}>
                      <div className="notification-product-icon">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <FiPackage />
                        )}
                      </div>

                      <div className="notification-product-info">
                        <strong>{product.name}</strong>

                        <span>{product.category}</span>
                      </div>

                      <span className="out-of-stock-label">Out of stock</span>
                    </div>
                  ))}
                </div>
              )}

              {/* FOOTER */}

              {outOfStockProducts.length > 0 && (
                <div className="notification-footer">
                  <span>Please update inventory.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =================================
            ADMIN THEME TOGGLE
        ================================= */}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        {/* =================================
            PROFILE
        ================================= */}

        <div className="profile">
          <div className="profile-avatar">
            <FiUser />
          </div>

          <div className="profile-info">
            <strong>Admin</strong>

            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
