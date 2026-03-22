import React, { useState, useCallback, useEffect } from 'react';
import { FaArrowLeft, FaFileDownload } from 'react-icons/fa';
import { FiUsers, FiBriefcase, FiMail } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

import adminReportService from '../../../services/admin/adminReportService';
import AdminStatisticsKPICard from './AdminStatisticsKPICard';
import '../../../styles/admin/pages/statistics.css';

const AdminStatistics = () => {
  // State quản lý filters
  const [filterCriteria, setFilterCriteria] = useState('Theo tháng');
  const [filterDate, setFilterDate] = useState('2026-03');
  const [selectedHr, setSelectedHr] = useState('all');
  const [hrList, setHrList] = useState([]);

  // State quản lý dữ liệu
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCVsReceived: 0,
    totalOpenJobs: 0,
    totalEmailsSent: 0,
    cvPassRate: '0%',
    chartData: []
  });

  // Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Fetch danh sách HR
  const fetchHRList = useCallback(async () => {
    try {
      const response = await adminReportService.getAllHRs();
      if (response && response.success) {
        const hrData = response.data || [];
        // Filter chỉ lấy HR có status active
        const activeHRs = hrData.filter(hr => hr.status === 'active');
        setHrList(activeHRs);
      } else {
        throw new Error(response?.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách HR:', error);
      toast.error('Không thể tải danh sách HR. ' + (error.message || ''));
    }
  }, []);

  // Fetch thống kê hệ thống
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const hrId = selectedHr === 'all' ? null : selectedHr;
      const response = await adminReportService.getSystemStatistics(
        filterCriteria,
        filterDate,
        hrId
      );

      if (response && response.success && response.data) {
        // Sử dụng dữ liệu thực từ API
        setStats({
          totalCVsReceived: response.data.totalCVsReceived || 0,
          totalOpenJobs: response.data.totalOpenJobs || 0,
          totalEmailsSent: response.data.totalEmailsSent || 0,
          cvPassRate: response.data.cvPassRate || '0%',
          chartData: response.data.chartData || []
        });
      } else {
        throw new Error(response?.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải thống kê:', error);
      toast.error('Không thể tải dữ liệu thống kê. ' + (error.message || ''));
      // Fallback to mock data để UI không bị trống
      setStats({
        totalCVsReceived: 0,
        totalOpenJobs: 0,
        totalEmailsSent: 0,
        cvPassRate: '0%',
        chartData: []
      });
    } finally {
      setLoading(false);
    }
  }, [filterCriteria, filterDate, selectedHr]);

  // Load initial data
  useEffect(() => {
    fetchHRList();
    fetchStatistics();
  }, []);

  // Fetch khi filter thay đổi
  useEffect(() => {
    fetchStatistics();
  }, [filterCriteria, filterDate, selectedHr, fetchStatistics]);

  // --- EXPORT LOGIC ---
  const exportToExcel = () => {
    const summaryData = [
      { 'Chỉ số': 'Tổng CV đã tiếp nhận (Hệ thống)', 'Giá trị': stats.totalCVsReceived },
      { 'Chỉ số': 'Tổng công việc đang mở', 'Giá trị': stats.totalOpenJobs },
      { 'Chỉ số': 'Tổng email đã gửi', 'Giá trị': stats.totalEmailsSent },
      { 'Chỉ số': 'Tỷ lệ pass CV (AI)', 'Giá trị': stats.cvPassRate },
      { 'Chỉ số': '', 'Giá trị': '' }
    ];

    const chartDataFormatted = stats.chartData.map(item => ({
      'Thời gian': item.name,
      'CV tiếp nhận': item.blueValue,
      'Lịch phỏng vấn': item.orangeValue,
      'Hoàn thành': item.grayValue
    }));

    const finalData = [...summaryData, ...chartDataFormatted];
    const ws = XLSX.utils.json_to_sheet(finalData);
    ws['!cols'] = [{ wch: 35 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thong_Ke_Tong_Hop");
    XLSX.writeFile(wb, `Thong_Ke_Admin_${filterCriteria.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Xuất Excel thành công!');
  };

  const exportToPDF = async () => {
    const reportElement = document.getElementById("admin-report-content");
    if (!reportElement) {
      toast.error("Không tìm thấy nội dung để xuất PDF!");
      return;
    }

    try {
      toast.info("Đang xử lý PDF, vui lòng chờ...", { autoClose: 2000 });
      const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: "#f8f9fa" });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Thong_Ke_Admin_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi xuất PDF:", error);
      toast.error("Đã xảy ra lỗi khi tạo file PDF.");
    }
  };

  const handleExport = () => {
    if (exportFormat === 'excel') {
      exportToExcel();
    } else {
      exportToPDF();
    }
    setShowExportModal(false);
  };

  return (
    <div className="admin-statistics-container">
      {/* Header */}
      <div className="admin-statistics-header">
        <h1 className="admin-statistics-title">Thống kê hệ thống</h1>
        <p className="admin-statistics-subtitle">
          Xem báo cáo và phân tích dữ liệu hoạt động của toàn bộ tài khoản HR
        </p>
      </div>

      {/* Main Content */}
      <div id="admin-report-content" className="admin-statistics-content">
        {/* Left Column - Filters & KPI Cards */}
        <div className="admin-stats-left">
          {/* Filters Card */}
          <div className="admin-filters-card">
            <h3 className="admin-filters-title">Bộ lọc</h3>

            {/* Filter by HR */}
            <div className="admin-filter-row">
              <label className="admin-filter-label">Lọc theo HR:</label>
              <select
                className="admin-filter-input"
                value={selectedHr}
                onChange={(e) => setSelectedHr(e.target.value)}
              >
                <option value="all">Tất cả HR</option>
                {hrList.map((hr) => (
                  <option key={hr.id} value={hr.id}>
                    {hr.fullName || hr.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Criteria */}
            <div className="admin-filter-row">
              <label className="admin-filter-label">Tiêu chí lọc:</label>
              <select
                className="admin-filter-input"
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              >
                <option value="Theo tháng">Theo tháng</option>
                <option value="Theo quý">Theo quý</option>
                <option value="Theo năm">Theo năm</option>
              </select>
            </div>

            {/* Filter by Date */}
            <div className="admin-filter-row">
              <label className="admin-filter-label">Thời gian:</label>
              <input
                type="month"
                className="admin-filter-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="admin-kpi-grid">
            {loading ? (
              <div className="admin-loading">Đang tải dữ liệu...</div>
            ) : (
              <>
                <AdminStatisticsKPICard
                  icon={FiUsers}
                  title="Tổng CV đã tiếp nhận"
                  value={stats.totalCVsReceived}
                  unit="CV"
                  color="#0d6efd"
                  trend={{ positive: true, text: '+15% so với tháng trước' }}
                />
                <AdminStatisticsKPICard
                  icon={FiBriefcase}
                  title="Công việc đang mở"
                  value={stats.totalOpenJobs}
                  unit="công việc"
                  color="#198754"
                />
                <AdminStatisticsKPICard
                  icon={FiMail}
                  title="Email đã gửi"
                  value={stats.totalEmailsSent}
                  unit="email"
                  color="#fd7e14"
                  trend={{ positive: true, text: '+8% so với tháng trước' }}
                />
                <AdminStatisticsKPICard
                  icon={MdCheckCircle}
                  title="Tỷ lệ pass AI"
                  value={parseFloat(stats.cvPassRate.replace('%', ''))}
                  unit="%"
                  color="#6f42c1"
                  trend={{ positive: true, text: '+2.3% so với tháng trước' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Column - Chart */}
        <div className="admin-stats-right">
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">Biểu đồ thống kê - CV & Lịch phỏng vấn</h3>
            <div className="admin-chart-container">
              {loading ? (
                <div className="admin-loading">Đang tải biểu đồ...</div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                    <XAxis dataKey="name" tick={{ fill: '#6c757d', fontSize: 12 }} axisLine={{ stroke: '#ced4da' }} tickLine={false} />
                    <YAxis tick={{ fill: '#6c757d', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8f9fa' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                    <Bar dataKey="blueValue" name="CV tiếp nhận" fill="#0d6efd" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      <LabelList dataKey="blueValue" position="top" fill="#6c757d" fontSize={11} fontWeight={600} />
                    </Bar>
                    <Bar dataKey="orangeValue" name="Lịch phỏng vấn" fill="#fd7e14" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      <LabelList dataKey="orangeValue" position="top" fill="#6c757d" fontSize={11} fontWeight={600} />
                    </Bar>
                    <Bar dataKey="grayValue" name="Hoàn thành" fill="#6c757d" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      <LabelList dataKey="grayValue" position="top" fill="#6c757d" fontSize={11} fontWeight={600} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Export Button */}
      <div className="admin-statistics-footer">
        <button
          className="admin-btn-export"
          onClick={() => setShowExportModal(true)}
          disabled={loading}
        >
          <FaFileDownload className="me-2" />
          Xuất dữ liệu
        </button>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="admin-export-modal-overlay">
          <div className="admin-export-modal">
            <div className="admin-export-modal-header">
              <h5 className="admin-export-modal-title">Xuất dữ liệu thống kê</h5>
              <button
                className="admin-export-modal-close"
                onClick={() => setShowExportModal(false)}
                title="Đóng"
              >
                ×
              </button>
            </div>

            <div className="admin-export-modal-body">
              <div className="admin-export-modal-row">
                <label className="admin-export-modal-label">Chọn định dạng:</label>
                <select
                  className="admin-export-modal-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>

            <div className="admin-export-modal-footer">
              <button
                className="admin-export-modal-btn admin-export-modal-btn--cancel"
                onClick={() => setShowExportModal(false)}
              >
                Hủy
              </button>
              <button
                className="admin-export-modal-btn admin-export-modal-btn--download"
                onClick={handleExport}
              >
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;
