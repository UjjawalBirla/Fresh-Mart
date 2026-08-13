import { FiMoon, FiSun } from "react-icons/fi";

import { useAdminTheme } from "../../contexts/AdminThemeContext";

import "./AdminThemeToggle.css";

function AdminThemeToggle() {
  const { theme, toggleAdminTheme } = useAdminTheme();

  return (
    <button
      type="button"
      className="admin-theme-toggle"
      onClick={toggleAdminTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      <span className="admin-theme-toggle-icon">
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </span>

      <span className="admin-theme-toggle-text">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default AdminThemeToggle;
