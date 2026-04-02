import React, { useState, useEffect } from "react";
import { MdPeople, MdEmail, MdCheckCircle, MdAssignment } from "react-icons/md";
import reportService from "../../../services/client/reportService";

const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`stats-card ${colorClass}`}>
    <div className="stats-card__icon">
      <Icon size={24} />
    </div>
    <div className="stats-card__info">
      <h3 className="stats-card__title">{title}</h3>
      <p className="stats-card__value">{value}</p>
    </div>
  </div>
);

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalCVs: 0,
    totalEmailsSent: 0,
    responseRate: "0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await reportService.getStatistics("Toàn thời gian", "");
        if (res && res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="stats-loading">Đang tải thống kê...</div>;
  }

  return (
    <div className="stats-overview">
      <StatsCard
        title="Số lượng CV"
        value={stats.totalCVs}
        icon={MdPeople}
        colorClass="stats-card--blue"
      />
      <StatsCard
        title="Phỏng vấn"
        value={stats.totalEmailsSent}
        icon={MdEmail}
        colorClass="stats-card--orange"
      />
      <StatsCard
        title="Hoàn thành"
        value={stats.responseRate}
        icon={MdCheckCircle}
        colorClass="stats-card--green"
      />
      {/* Optional: Add a card for Active Jobs if available */}
    </div>
  );
};

export default StatsOverview;
