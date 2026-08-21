import { useEffect, useState } from "react";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiMenu,
  FiSun,
  FiMoon,
  FiAlertTriangle,
  FiPackage,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../Firebase/Firebase";

function Navbar({ openSidebar }) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchOutOfStockProducts();
    const interval = setInterval(() => {
      fetchOutOfStockProducts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = async () => {
    const newState = !notificationOpen;
    setNotificationOpen(newState);
    if (newState) {
      await fetchOutOfStockProducts();
    }
  };

  const closeNotifications = () => {
    setNotificationOpen(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result?.success) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-18 items-center justify-between border-b border-market-leaf/10 bg-white/85 px-4 shadow-md shadow-market-leaf/5 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 md:px-8">
      {/* Left Area */}
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="btn-ghost lg:hidden"
          onClick={openSidebar}
          aria-label="Open menu"
        >
          <FiMenu className="text-lg" />
        </button>

        {/* Global Admin Search */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 shadow-xs transition-all duration-300 focus-within:border-market-leaf focus-within:bg-white focus-within:ring-2 focus-within:ring-market-leaf/20 focus-within:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-market-leaf-light dark:focus-within:bg-slate-800">
          <FiSearch className="text-slate-400" />
          <input
            className="w-44 md:w-64 border-0 bg-transparent text-xs md:text-sm outline-none text-slate-800 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            type="text"
            placeholder="Quick search products..."
          />
        </div>
      </div>

      {/* Right Actions Area */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-market-lime/40 text-market-leaf shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-market-lime hover:shadow-md active:scale-95 dark:bg-slate-800 dark:text-market-lime dark:hover:bg-slate-700"
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <FiBell className="text-lg" />

            {outOfStockProducts.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-market-coral px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {outOfStockProducts.length > 99 ? "99+" : outOfStockProducts.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={closeNotifications}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-13 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-400/20 backdrop-blur-xl animate-rise dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/50">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div>
                    <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                      Notifications
                    </strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Inventory alerts & stock updates
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={closeNotifications}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close notifications"
                  >
                    <FiX />
                  </button>
                </div>

                {/* Body Content */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {notificationLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-market-leaf border-t-transparent" />
                      <span>Checking inventory...</span>
                    </div>
                  ) : outOfStockProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-2xl text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <FiPackage />
                      </div>
                      <strong className="text-sm text-slate-700 dark:text-slate-200">
                        All products are in stock
                      </strong>
                      <span className="text-xs text-slate-400">
                        No inventory alerts right now.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <FiAlertTriangle className="text-sm" />
                        <span>
                          {outOfStockProducts.length} product
                          {outOfStockProducts.length !== 1 ? "s" : ""} out of stock
                        </span>
                      </div>

                      {outOfStockProducts.map((product) => (
                        <div
                          className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                          key={product.id}
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FiPackage className="text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <strong className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                              {product.name}
                            </strong>
                            <span className="text-[10px] text-slate-400">
                              {product.category}
                            </span>
                          </div>

                          <span className="badge-danger shrink-0 text-[10px]">
                            Out of stock
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {outOfStockProducts.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    Please restock or update inventory.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl bg-market-sun/20 text-amber-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-market-sun/40 hover:shadow-md active:scale-95 dark:bg-amber-900/30 dark:text-market-sun"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          {theme === "light" ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
        </button>

        {/* Profile Pill */}
        <div className="hidden items-center gap-2.5 rounded-2xl border border-market-leaf/10 bg-market-cream/70 px-3 py-1.5 shadow-xs backdrop-blur-sm sm:flex dark:border-slate-700 dark:bg-slate-800">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-market-leaf text-sm font-bold text-white shadow-xs">
            <FiUser />
          </div>
          <div className="leading-tight">
            <strong className="block text-xs font-bold text-slate-800 dark:text-white">Admin</strong>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Administrator</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-market-leaf px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-market-leaf/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-market-leaf-dark hover:shadow-lg hover:shadow-market-leaf/30 active:scale-95"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <FiLogOut className="text-sm" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
