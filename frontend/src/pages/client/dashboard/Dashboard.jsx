import "../../../styles/client/pages/jobManagement.css";
import StatsOverview from "./StatsOverview";

/**
 * Dashboard Component
 * Manages the high-level system overview.
 */
const Dashboard = () => {
  return (
    <div className="dashboard-wrapper" style={{ padding: "24px", minHeight: "100vh", background: "#f8f9fa" }}>
      <div className="job-page__header">
        <div>
          <h1 className="job-page__title">Tổng quan hệ thống</h1>
          <p className="job-page__subtitle">
            Xem nhanh các chỉ số quan trọng và trạng thái tuyển dụng
          </p>
        </div>
      </div>
      <StatsOverview />
    </div>
  );
};

export default Dashboard;