import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"} replace />;
};

export default DashboardRedirect;
