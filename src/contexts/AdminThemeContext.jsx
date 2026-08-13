import { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext(null);

// =====================================================
// ADMIN THEME PROVIDER
// =====================================================

export function AdminThemeProvider({ children }) {
  // ===================================================
  // INITIAL THEME
  // ===================================================

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("freshmart_admin_theme");

    return savedTheme === "dark" ? "dark" : "light";
  });

  // ===================================================
  // APPLY ADMIN THEME
  // ===================================================

  useEffect(() => {
    const root = document.documentElement;

    const body = document.body;

    /*
      IMPORTANT

      Admin theme uses a completely
      separate storage key:

      freshmart_admin_theme

      User theme uses:

      freshmart_user_theme

      So changing one will NOT change
      the other.
    */

    root.dataset.adminTheme = theme;

    body.dataset.adminTheme = theme;

    localStorage.setItem("freshmart_admin_theme", theme);
  }, [theme]);

  // ===================================================
  // TOGGLE ADMIN THEME
  // ===================================================

  const toggleAdminTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // ===================================================
  // CHANGE ADMIN THEME
  // ===================================================

  const changeAdminTheme = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") {
      return;
    }

    setTheme(newTheme);
  };

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    theme,

    isDark: theme === "dark",

    isLight: theme === "light",

    toggleAdminTheme,

    changeAdminTheme,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// =====================================================
// USE ADMIN THEME
// =====================================================

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);

  if (!context) {
    throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  }

  return context;
}

export default AdminThemeContext;
