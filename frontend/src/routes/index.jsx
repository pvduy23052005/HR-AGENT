import { Navigate } from "react-router-dom";
import LayoutDefault from "../layouts/admin/layoutDefault";
import LayoutClientDefault from "../layouts/client/layoutClientDefault";
import routeDashboard from "./admin/routeDashboard";
import routeUser from "./admin/routeUser";
import routeAiConfig from "./admin/routeAiConfig";
import routeStatistics from "./admin/routeStatistics";
import routeAuth from "./admin/routeAuth";
import routeClientAuth from "./client/routeClientAuth";

import ProtectedRoute from "./ProtectedRoute";
import ClientProtectedRoute from "./ClientProtectedRoute";
import UploadCV from "../pages/client/UploadCV/UploadCV";
import Dashbroad from "../pages/client/dashbroad/dashbroad";
import CandidateManagement from "../pages/client/CandidateManagement/CandidateManagement";
import CandidateDetail from "../pages/client/CandidateManagement/CandidateDetail";
import CandidateAIAnalysis from "../pages/client/CandidateManagement/CandidateAIAnalysis";

const routes = [
  {
    path: "/",
    children: [routeClientAuth],
  },

  {
    element: <ClientProtectedRoute />,
    children: [
      {
        path: "/",
        element: <LayoutClientDefault />,
        children: [
          { path: "dashboard", element: <Dashbroad /> },
          { path: "upload_cv", element: <UploadCV /> },
          { path: "applications", element: <CandidateManagement /> },
          { path: "applications/:id", element: <CandidateDetail /> },
          { path: "applications/:id/ai-analysis", element: <CandidateAIAnalysis /> },
        ],
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
