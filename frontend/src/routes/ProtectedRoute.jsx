import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/admin/auth/useAuth";

const ProtectedRoute = () => {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
