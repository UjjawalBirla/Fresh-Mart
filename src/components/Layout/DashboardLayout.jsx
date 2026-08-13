import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import { ThemeProvider } from "../../contexts/ThemeContext";

import "./DashboardLayout.css";

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
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <div className="dashboard-main">
          <Navbar openSidebar={openSidebar} />

          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default DashboardLayout;
