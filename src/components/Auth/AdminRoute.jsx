import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import PageLoader from "../PageLoader/PageLoader";

function AdminRoute({ children }) {
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
  // USER IS NOT ADMIN
  // =========================================

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // =========================================
  // ADMIN ACCESS
  // =========================================

  return children;
}

export default AdminRoute;
