import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminThemeProvider } from "./contexts/AdminThemeContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <AdminThemeProvider>
            <App />
          </AdminThemeProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);

