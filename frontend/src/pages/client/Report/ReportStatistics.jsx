import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import reportService from '../../../services/client/reportService';
import { toast } from 'react-toastify';
import '../../../styles/client/pages/reportStatistics.css';

const ReportStatistics = () => {
  const navigate = useNavigate();
  const [filterCriteria, setFilterCriteria] = useState('Theo tháng');
  const [filterDate, setFilterDate] = useState('2026-03'); 
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCVs: 0,
    totalEmailsSent: 0,
    responseRate: '0%',
    chartData: []
  });

  React.useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await reportService.getStatistics(filterCriteria, filterDate);
        if (response && response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        toast.error('Lỗi khi tải dữ liệu thống kê!');
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, [filterCriteria, filterDate]);
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="report-page-container">
      {/* Header Area */}
      <div className="report-header">
        <a href="#!" className="report-back-btn" onClick={(e) => { e.preventDefault(); handleBack(); }}>
          <FaArrowLeft className="me-2" />
          &lt;- Quay lại
        </a>
        <h1 className="report-title">Báo cáo &amp; Thống kê</h1>
      </div>

      {/* Main Content Area */}
      <div className="report-content-wrapper">
        {/* Left Column (40%) */}
        <div className="report-left-col">
          {/* Filters Card */}
          <div className="report-filters-card mb-4">
            <div className="filter-row">
              <label className="filter-label">Tiêu chí lọc :</label>
              <select
                className="filter-input"
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              >
                <option value="Theo tháng">Theo tháng</option>
                <option value="Theo quý">Theo quý</option>
                <option value="Theo năm">Theo năm</option>
              </select>
            </div>
            <div className="filter-row">
              <label className="filter-label">Thời gian :</label>
              <input
                type="month"
                className="filter-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="report-stats-card">
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              <>
                <div className="stat-row">
                  <span className="stat-label">Số lượng CV đã tiếp nhận:</span>
                  <span className="stat-value">{stats.totalCVs}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Số lịch phỏng vấn đã tạo:</span>
                  <span className="stat-value">{stats.totalEmailsSent}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Tỷ lệ phỏng vấn hoàn thành:</span>
                  <span className="stat-value">{stats.responseRate}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column (60%) */}
        <div className="report-right-col">
          <div className="report-chart-card">
            <h5 className="chart-title mb-4">Biểu đồ thống kê CV</h5>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <span>Đang tải biểu đồ...</span>
                  </div>
                ) : (
                  <BarChart
                    data={stats.chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#6c757d' }} axisLine={{ stroke: '#ced4da' }} tickLine={false} />
                  <YAxis tick={{ fill: '#6c757d' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8f9fa' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  
                  <Bar dataKey="blueValue" name="CV tiếp nhận" fill="#0d6efd" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    <LabelList dataKey="blueValue" position="top" fill="#6c757d" fontSize={12} fontWeight={600} />
                  </Bar>
                  <Bar dataKey="orangeValue" name="Lịch phỏng vấn" fill="#fd7e14" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    <LabelList dataKey="orangeValue" position="top" fill="#6c757d" fontSize={12} fontWeight={600} />
                  </Bar>
                  <Bar dataKey="grayValue" name="Hoàn thành" fill="#6c757d" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    <LabelList dataKey="grayValue" position="top" fill="#6c757d" fontSize={12} fontWeight={600} />
                  </Bar>
                </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="report-footer">
        <button className="btn btn-export-data">
          Xuất dữ liệu
        </button>
      </div>
    </div>
  );
};

export default ReportStatistics;
