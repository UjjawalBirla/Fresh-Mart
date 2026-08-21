import { FiMoon, FiSun } from "react-icons/fi";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

function AdminThemeToggle() {
  const { theme, toggleAdminTheme } = useAdminTheme();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-market-leaf/20 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-market-leaf hover:bg-market-lime/30 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-market-lime"
      onClick={toggleAdminTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      <span className="text-amber-500 text-sm transition-transform duration-300 group-hover:rotate-45">
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </span>
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

export default AdminThemeToggle;
