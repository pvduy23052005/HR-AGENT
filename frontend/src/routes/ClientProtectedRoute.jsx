import { Navigate, Outlet } from "react-router-dom";

const ClientProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default ClientProtectedRoute;
