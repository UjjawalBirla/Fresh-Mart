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

import "./Sidebar.css";

function Sidebar({ isOpen, closeSidebar }) {
  // =========================================
  // ADMIN MENU
  // =========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
    },

    {
      name: "Fruits",
      path: "/admin/fruits",
      icon: <FiShoppingBag />,
    },

    {
      name: "Vegetables",
      path: "/admin/vegetables",
      icon: <FiPackage />,
    },

    {
      name: "Groceries",
      path: "/admin/groceries",
      icon: <FiShoppingCart />,
    },

    {
      name: "Offers Zone",
      path: "/admin/offers",
      icon: <FiTag />,
    },
  ];

  return (
    <>
      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* =========================================
            LOGO
        ========================================= */}

        <div className="sidebar-logo">
          <div className="logo-icon">🍃</div>

          <div>
            <h2>FreshMart</h2>

            <span>Admin Panel</span>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* =========================================
            MAIN MENU
        ========================================= */}

        <div className="sidebar-section">
          <p className="sidebar-title">MAIN MENU</p>

          <nav>
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <span className="sidebar-icon">{item.icon}</span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* =========================================
            MANAGEMENT
        ========================================= */}

        <div className="sidebar-section">
          <p className="sidebar-title">MANAGEMENT</p>

          {/* ORDERS */}

          <NavLink
            to="/admin/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <FiShoppingCart />
            </span>

            <span>Orders</span>
          </NavLink>

          {/* CUSTOMERS */}

          <NavLink
            to="/admin/customers"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <FiUsers />
            </span>

            <span>Customers</span>
          </NavLink>

          {/* SETTINGS */}

          <NavLink
            to="/admin/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <FiSettings />
            </span>

            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
