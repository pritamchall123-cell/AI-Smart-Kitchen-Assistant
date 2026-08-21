// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Stricter than ProtectedRoute — requires the user to be logged in AND have role === "admin"
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;