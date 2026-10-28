import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const EntryRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="py-16 text-center text-gray-600">Loading your account...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
      replace
    />
  );
};

export default EntryRoute;
