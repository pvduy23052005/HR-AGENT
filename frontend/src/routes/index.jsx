import { Navigate } from "react-router-dom";
import LayoutDefault from "../layouts/admin/layoutDefault";
import LayoutClientDefault from "../layouts/client/layoutClientDefault";
import routeDashboard from "./admin/routeDashboard";
import routeUser from "./admin/routeUser";
import routeAiConfig from "./admin/routeAiConfig";
import routeStatistics from "./admin/routeStatistics";
import routeInterviewSchedule from "./admin/routeInterviewSchedule";
import routeAuth from "./admin/routeAuth";
import routeClientAuth from "./client/routeClientAuth";

import ProtectedRoute from "./ProtectedRoute";
import ClientProtectedRoute from "./ClientProtectedRoute";
import UploadCV from "../pages/client/UploadCV/UploadCV";
import Dashbroad from "../pages/client/dashbroad/dashbroad";
import CandidateManagement from "../pages/client/CandidateManagement/CandidateManagement";

import CandidateDetail from "../pages/client/CandidateManagement/CandidateDetail";
import VerificationDetail from "../pages/client/Verification/VerificationDetail";
import CandidateAIAnalysis from "../pages/client/CandidateManagement/CandidateAIAnalysis";
import ScheduleInterviewPage from "../pages/client/CandidateManagement/ScheduleInterviewPage";
import EmailTemplates from "../pages/client/Email/EmailTemplates";
import EmailDetail from "../pages/client/Email/EmailDetail";

import JobManagement from "../pages/client/JobManagement/JobManagement";
import JobCreate from "../pages/client/JobManagement/JobCreate";
import ReportStatistics from "../pages/client/Report/ReportStatistics";

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
          { path: "candidates", element: <CandidateManagement /> },
          { path: "candidates/emails", element: <EmailTemplates /> },
          { path: "candidates/emails/:id/detail", element: <EmailDetail /> },
          { path: "candidates/:id", element: <CandidateDetail /> },
          { path: "candidates/:id/verify", element: <VerificationDetail /> },
          { path: "candidates/:id/schedule", element: <ScheduleInterviewPage /> },
          { path: "candidates/:id/ai-analysis", element: <CandidateAIAnalysis /> },

          { path: "jobs", element: <JobManagement /> },
          { path: "jobs/create", element: <JobCreate /> },
          { path: "reports", element: <ReportStatistics /> },
          {
            path: "upload_cv",
            element: <UploadCV />,
          },
          {
            path: "candidates",
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
        children: [routeDashboard, routeUser, routeAiConfig, routeStatistics, routeInterviewSchedule],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
];

export default routes;
