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
  FiHeart,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";

function UserLayoutContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearch = () => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/?search=true");
      return;
    }

    const searchInput = document.getElementById("home-search");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <div className="min-h-screen flex flex-col bg-market-cream/30 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Sticky Top Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 flex min-h-[4.5rem] items-center justify-between border-b border-market-leaf/10 bg-white/85 px-4 shadow-md shadow-market-leaf/5 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90 md:px-8">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            className="btn-ghost md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>

          <NavLink
            to="/"
            className="group inline-flex items-center gap-2.5 font-display text-xl font-black text-slate-800 transition-all duration-300 hover:-translate-y-0.5 dark:text-white"
            onClick={closeMenu}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-market-lime text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              🍃
            </span>
            <span className="tracking-tight">
              Fresh<span className="text-market-leaf dark:text-market-lime">Mart</span>
            </span>
          </NavLink>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
          <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Search */}
          <button
            type="button"
            className="btn-ghost"
            title="Search Products"
            onClick={handleSearch}
          >
            <FiSearch className="text-lg" />
          </button>

          {/* Shopping Cart */}
          <button
            type="button"
            className="btn-ghost relative"
            title="Shopping Cart"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-market-coral px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl bg-market-sun/20 text-amber-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-market-sun/40 hover:shadow-md active:scale-95 dark:bg-amber-900/30 dark:text-market-sun"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
          </button>

          {/* User Profile Pill */}
          <div className="hidden items-center gap-2.5 rounded-2xl border border-market-leaf/10 bg-market-cream/80 px-3 py-1.5 shadow-xs backdrop-blur-sm lg:flex dark:border-slate-700 dark:bg-slate-800">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-market-leaf text-sm font-bold text-white shadow-xs">
              <FiUser />
            </div>
            <div className="leading-tight">
              <strong className="block max-w-28 truncate text-xs font-bold text-slate-800 dark:text-white">
                {user?.name || "Member"}
              </strong>
              <span className="block max-w-28 truncate text-[10px] text-slate-500 dark:text-slate-400">
                {user?.email || "Shopper"}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-red-200 text-red-500 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md active:scale-95 md:grid dark:border-red-900/50 dark:hover:bg-red-950/40"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed left-0 top-[4.5rem] z-40 flex w-full flex-col gap-1.5 border-b border-market-leaf/10 bg-white/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/95 md:hidden ${
          menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>🏠</span> Home
        </NavLink>
        <NavLink
          to="/about"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>ℹ️</span> About Us
        </NavLink>
        <NavLink
          to="/menu"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>🛒</span> Menu
        </NavLink>
        <NavLink
          to="/contact"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>📞</span> Contact
        </NavLink>
        <NavLink
          to="/orders"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>📦</span> My Orders
        </NavLink>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-market-lime/30 hover:translate-x-1 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => {
            closeMenu();
            navigate("/cart");
          }}
        >
          <FiShoppingCart className="text-base" />
          <span>Shopping Cart</span>
          {cartCount > 0 && (
            <span className="ml-auto rounded-full bg-market-coral px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
              {cartCount}
            </span>
          )}
        </button>

        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50 hover:translate-x-1 dark:text-red-400 dark:hover:bg-red-950/40"
          onClick={handleLogout}
        >
          <FiLogOut className="text-base" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Page Area */}
      <main className="flex-1 pt-[4.5rem]">
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-market-leaf/10 bg-white/80 px-4 py-8 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-market-lime text-lg">
              🍃
            </span>
            <strong className="font-display text-lg font-black text-slate-800 dark:text-white">
              FreshMart
            </strong>
            <span className="text-xs text-slate-400">· Fresh groceries delivered daily</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <NavLink to="/about" className="hover:text-market-leaf transition-colors">About</NavLink>
            <NavLink to="/menu" className="hover:text-market-leaf transition-colors">Menu</NavLink>
            <NavLink to="/contact" className="hover:text-market-leaf transition-colors">Contact</NavLink>
            <NavLink to="/orders" className="hover:text-market-leaf transition-colors">Orders</NavLink>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
        </div>
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
