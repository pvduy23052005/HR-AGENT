import { Routes, Route, Navigate } from "react-router-dom";
import LayoutDefault from "./layouts/admin/layoutDefault";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/User";
import AiConfig from "./pages/admin/AiConfig";
import Statistics from "./pages/admin/statistics";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<LayoutDefault />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="ai-config" element={<AiConfig />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
