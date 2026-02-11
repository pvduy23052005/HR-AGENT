import { Navigate } from "react-router-dom";
import LayoutDefault from "../layouts/admin/layoutDefault";

import routeDashboard from "./admin/routeDashboard";
import routeUser from "./admin/routeUser";
import routeAiConfig from "./admin/routeAiConfig";
import routeStatistics from "./admin/routeStatistics";
import routeAuth from "./admin/routeAuth";

const routes = [
  {
    path: "/admin",
    element: <LayoutDefault />,
    children: [routeDashboard, routeUser, routeAiConfig, routeStatistics],
  },
  {
    path: "/admin",
    children: [routeAuth],
  },
  {
    path: "*",
    element: <Navigate to="/admin/auth/login" replace />,
  },
];

export default routes;
