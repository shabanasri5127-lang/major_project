import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="py-16 text-center text-gray-600">Loading your account...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "doctor" ? "/doctor-dashboard" : "/dashboard"} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
