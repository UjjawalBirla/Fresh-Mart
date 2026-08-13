import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import PageLoader from "../PageLoader/PageLoader";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // =========================================
  // AUTH LOADING
  // =========================================

  if (loading) {
    return <PageLoader />;
  }

  // =========================================
  // NOT LOGGED IN
  // =========================================

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // =========================================
  // ADMIN CANNOT USE USER ROUTES
  // =========================================

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // =========================================
  // NORMAL USER
  // =========================================

  return children;
}

export default ProtectedRoute;
