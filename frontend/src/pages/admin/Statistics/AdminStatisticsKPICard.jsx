import React from 'react';

const AdminStatisticsKPICard = ({ icon: Icon, title, value, unit = '', trend = null, color = '#0d6efd' }) => {
  return (
    <div className="admin-kpi-card" style={{ borderLeftColor: color }}>
      <div className="admin-kpi-card__icon" style={{ backgroundColor: `${color}20` }}>
        {Icon && <Icon style={{ color }} size={24} />}
      </div>
      <div className="admin-kpi-card__content">
        <p className="admin-kpi-card__title">{title}</p>
        <p className="admin-kpi-card__value">
          {value.toLocaleString('vi-VN')} <span className="admin-kpi-card__unit">{unit}</span>
        </p>
        {trend && (
          <p className={`admin-kpi-card__trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.positive ? '↑' : '↓'} {trend.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminStatisticsKPICard;
