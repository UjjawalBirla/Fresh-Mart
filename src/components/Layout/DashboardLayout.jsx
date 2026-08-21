import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import { ThemeProvider } from "../../contexts/ThemeContext";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider storageKey="adminTheme">
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-64">
          <Navbar openSidebar={openSidebar} />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default DashboardLayout;
