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
import JobManagement from "../pages/client/JobManagement/JobManagement";
import JobCreate from "../pages/client/JobManagement/JobCreate";

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
          { path: "jobs", element: <JobManagement /> },
          { path: "jobs/create", element: <JobCreate /> },
          {
            path: "upload_cv",
            element: <UploadCV />,
          },
          {
            path: "applications",
            element: <CandidateManagement />,
          },
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
