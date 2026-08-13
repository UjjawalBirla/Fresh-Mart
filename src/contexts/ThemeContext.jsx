import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// =====================================================
// THEME PROVIDER
// =====================================================

export function ThemeProvider({
  children,
  storageKey = "freshmart_user_theme",
}) {
  // ===================================================
  // INITIAL THEME
  // ===================================================

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(storageKey);

    return savedTheme === "dark" ? "dark" : "light";
  });

  // ===================================================
  // APPLY THEME
  // ===================================================

  useEffect(() => {
    const root = document.documentElement;

    const body = document.body;

    root.dataset.theme = theme;

    body.dataset.theme = theme;

    // IMPORTANT:
    // User theme is stored using its own key.
    // Admin theme will use a different key.
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // ===================================================
  // TOGGLE THEME
  // ===================================================

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // ===================================================
  // SET SPECIFIC THEME
  // ===================================================

  const changeTheme = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") {
      return;
    }

    setTheme(newTheme);
  };

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <ThemeContext.Provider
      value={{
        theme,

        isDark: theme === "dark",

        isLight: theme === "light",

        toggleTheme,

        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================================
// USE THEME
// =====================================================

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

export default ThemeContext;
