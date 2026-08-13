import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";

import "./UserLayout.css";

function UserLayoutContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const { cartCount } = useCart();

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const location = useLocation();

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      await logout();

      setMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =========================================
  // CLOSE MENU
  // =========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================
  // HOME SECTION NAVIGATION
  // =========================================

  const goToSection = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = () => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/?search=true");

      return;
    }

    const searchInput = document.getElementById("home-search");

    if (searchInput) {
      searchInput.focus();

      searchInput.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="user-layout">
      {/* =========================================
          NAVBAR
      ========================================= */}

      <header className="user-navbar">
        {/* =====================================
            LOGO
        ===================================== */}

        <div className="user-navbar-left">
          {/* MOBILE MENU */}

          <button
            type="button"
            className="user-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* LOGO */}

          <NavLink to="/" className="user-logo" onClick={closeMenu}>
            <span className="user-logo-icon">🍃</span>

            <span className="user-logo-text">
              Fresh<span>Mart</span>
            </span>
          </NavLink>
        </div>

        {/* =====================================
            DESKTOP NAVIGATION
        ===================================== */}

        <nav className="user-nav-links">
          {/* HOME */}

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "user-nav-link active" : "user-nav-link"
            }
          >
            Home
          </NavLink>

          {/* ABOUT */}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "user-nav-link active" : "user-nav-link"
            }
          >
            About Us
          </NavLink>

          {/* MENU */}

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive ? "user-nav-link active" : "user-nav-link"
            }
          >
            Menu
          </NavLink>

          {/* CONTACT */}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "user-nav-link active" : "user-nav-link"
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="user-navbar-right">
          {/* SEARCH */}

          <button
            type="button"
            className="user-action-btn"
            title="Search"
            onClick={handleSearch}
          >
            <FiSearch />
          </button>

          {/* CART */}

          <button
            type="button"
            className="user-action-btn cart-btn"
            title="Shopping Cart"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart />

            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {/* THEME */}

          <button
            type="button"
            className="user-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>

          {/* PROFILE */}

          <div className="user-profile">
            <div className="user-avatar">
              <FiUser />
            </div>

            <div className="user-profile-info">
              <strong>{user?.name || "User"}</strong>

              <span>{user?.email || ""}</span>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            className="user-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* =========================================
          MOBILE MENU
      ========================================= */}

      <div className={menuOpen ? "mobile-user-menu open" : "mobile-user-menu"}>
        <NavLink to="/" onClick={closeMenu}>
          🏠 Home
        </NavLink>

        <NavLink to="/about" onClick={closeMenu}>
          ℹ️ About Us
        </NavLink>

        <NavLink to="/menu" onClick={closeMenu}>
          🛒 Menu
        </NavLink>

        <NavLink to="/contact" onClick={closeMenu}>
          📞 Contact
        </NavLink>

        <button
          type="button"
          className="mobile-cart-link"
          onClick={() => {
            closeMenu();
            navigate("/cart");
          }}
        >
          <FiShoppingCart />
          Cart
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>

        <button type="button" className="mobile-logout" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="user-content">
        <Outlet />
      </main>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="user-footer">
        <div>
          🍃 <strong>FreshMart</strong>
        </div>

        <span>Fresh groceries. Fresh life.</span>
      </footer>
    </div>
  );
}

function UserLayout() {
  return (
    <ThemeProvider storageKey="userTheme">
      <UserLayoutContent />
    </ThemeProvider>
  );
}

export default UserLayout;
