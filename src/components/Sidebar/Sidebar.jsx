import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiTag,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiX,
} from "react-icons/fi";

function Sidebar({ isOpen, closeSidebar }) {
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiGrid /> },
    { name: "Fruits", path: "/admin/fruits", icon: <FiShoppingBag /> },
    { name: "Vegetables", path: "/admin/vegetables", icon: <FiPackage /> },
    { name: "Groceries", path: "/admin/groceries", icon: <FiShoppingCart /> },
    { name: "Offers Zone", path: "/admin/offers", icon: <FiTag /> },
  ];

  const sidebarLinkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
      isActive
        ? "bg-white/25 text-white shadow-lg shadow-black/10 backdrop-blur-md translate-x-1"
        : "text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1",
    ].join(" ");

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-market-leaf via-market-leaf-dark to-emerald-950 text-white shadow-2xl shadow-market-leaf/30 transition-transform duration-300 ease-out dark:from-slate-900 dark:via-slate-950 dark:to-black dark:shadow-black/70",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl shadow-inner backdrop-blur-md animate-float">
              🍃
            </span>
            <div>
              <h2 className="font-display text-xl font-black tracking-tight text-white">
                Fresh<span className="text-market-lime">Mart</span>
              </h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-market-lime/80">
                Admin Panel
              </span>
            </div>
          </div>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white shadow-sm transition-all duration-300 hover:bg-white/20 active:scale-95 lg:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Menu */}
          <div>
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-market-lime/75">
              Main Menu
            </p>

            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={closeSidebar}
                  className={sidebarLinkClass}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-base transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Management Section */}
          <div>
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-market-lime/75">
              Management
            </p>

            <nav className="space-y-1.5">
              <NavLink
                to="/admin/orders"
                onClick={closeSidebar}
                className={sidebarLinkClass}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-base transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <FiShoppingCart />
                </span>
                <span className="tracking-wide">Orders</span>
              </NavLink>

              <NavLink
                to="/admin/customers"
                onClick={closeSidebar}
                className={sidebarLinkClass}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-base transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <FiUsers />
                </span>
                <span className="tracking-wide">Customers</span>
              </NavLink>

              <NavLink
                to="/admin/settings"
                onClick={closeSidebar}
                className={sidebarLinkClass}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-base transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <FiSettings />
                </span>
                <span className="tracking-wide">Settings</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Footer Brand Pill */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-md shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-market-lime">
              <span>●</span> Store Online
            </div>
            <p className="mt-1 text-[11px] text-white/60">
              FreshMart Management Console
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
