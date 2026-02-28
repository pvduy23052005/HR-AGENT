import { Navigate } from "react-router-dom";
import LayoutDefault from "../layouts/admin/layoutDefault";
import routeDashboard from "./admin/routeDashboard";
import routeUser from "./admin/routeUser";
import routeAiConfig from "./admin/routeAiConfig";
import routeStatistics from "./admin/routeStatistics";
import routeAuth from "./admin/routeAuth";
import routeClientAuth from "./client/routeClientAuth";

import ProtectedRoute from "./ProtectedRoute";
import ClientProtectedRoute from "./ClientProtectedRoute";
import UploadCV from "../pages/client/UploadCV/UploadCV";

const routes = [
  // Client public routes
  {
    path: "/",
    children: [routeClientAuth],
  },

  // Client protected routes
  {
    element: <ClientProtectedRoute />,
    children: [
      {
        path: "/upload-cv",
        element: <UploadCV />,
      },
    ],
  },

  // Admin public route
  {
    path: "/admin",
    children: [routeAuth],
  },

  // Admin private route
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <LayoutDefault />,
        children: [routeDashboard, routeUser, routeAiConfig, routeStatistics],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
];

export default routes;
