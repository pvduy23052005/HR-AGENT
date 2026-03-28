import { Navigate } from "react-router-dom";
import LayoutDefault from "../layouts/admin/layoutDefault";
import LayoutClientDefault from "../layouts/client/layoutClientDefault";
import routeDashboard from "./admin/routeDashboard";
import routeUser from "./admin/routeUser";
import routeStatistics from "./admin/routeStatistics";
import routeInterviewSchedule from "./admin/routeInterviewSchedule";
import routeAuth from "./admin/routeAuth";
import routeClientAuth from "./client/routeClientAuth";

import ProtectedRoute from "./ProtectedRoute";
import ClientProtectedRoute from "./ClientProtectedRoute";
import Dashbroad from "../pages/client/dashbroad/dashbroad";
import CandidateManagement from "../pages/client/CandidateManagement/CandidateManagement";
import UserManagement from "../pages/client/UserManagement/UserManagement";
import UploadCV from "../pages/client/UploadCV/UploadCV";

import CandidateDetail from "../pages/client/CandidateManagement/CandidateDetail";
import VerificationDetail from "../pages/client/Verification/VerificationDetail";
import CandidateAIAnalysis from "../pages/client/CandidateManagement/CandidateAIAnalysis";
import ScheduleInterviewPage from "../pages/client/CandidateManagement/ScheduleInterviewPage";
import EmailTemplates from "../pages/client/Email/EmailTemplates";
import EmailDetail from "../pages/client/Email/EmailDetail";

import ReportStatistics from "../pages/client/Report/ReportStatistics";
import RecruitmentBoard from "../pages/client/RecruitmentProcess";
import JobList from "../pages/client/jobs";
import JobCandidates from "../pages/client/jobs/JobCandidates";
import JobDetail from "../pages/client/jobs/Detail";

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

          { path: "candidates", element: <CandidateManagement /> },
          { path: "users", element: <UserManagement /> },
          { path: "upload-cv", element: <UploadCV /> },
          { path: "candidates/emails", element: <EmailTemplates /> },
          { path: "candidates/emails/:id/detail", element: <EmailDetail /> },
          { path: "candidates/:id", element: <CandidateDetail /> },
          { path: "candidates/:id/verify", element: <VerificationDetail /> },
          {
            path: "candidates/:id/schedule",
            element: <ScheduleInterviewPage />,
          },
          {
            path: "candidates/:id/ai-analysis",
            element: <CandidateAIAnalysis />,
          },

          { path: "reports", element: <ReportStatistics /> },
          { path: "recruitment", element: <RecruitmentBoard /> },
          { path: "jobs", element: <JobList /> },
          { path: "jobs/:id", element: <JobDetail /> },
          { path: "jobs/:id/candidates", element: <JobCandidates /> },
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
        children: [
          routeDashboard,
          routeUser,
          routeStatistics,
          routeInterviewSchedule,
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
];

export default routes;
