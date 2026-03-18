import React, { useState, useCallback } from 'react';
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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  // Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Fetch statistics - wrapped in useCallback để tránh vấn đề closure
  const fetchStatistics = useCallback(async () => {
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
  }, [filterCriteria, filterDate]);

  React.useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Auto-refresh khi status thay đổi từ localStorage (sync across tabs)
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      // Lắng nghe thay đổi từ localStorage
      if (e.key === 'hr-agent-sync') {
        try {
          const syncData = JSON.parse(e.newValue);
          if (syncData && syncData.type === 'candidate-status-changed') {
            console.log('Detected status change from another tab, updating stats:', syncData);
            // Delay một chút để backend cập nhật xong
            setTimeout(() => {
              fetchStatistics();
            }, 1000);
          }
        } catch (err) {
          console.error('Error parsing sync data:', err);
        }
      }
    };

    // Listen để nhận thay đổi từ localStorage (từ tabs khác)
    window.addEventListener('storage', handleStorageChange);
    console.log('Storage listener registered for cross-tab sync');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchStatistics]);
  
  const handleBack = () => {
    navigate(-1);
  };

  // --- EXPORT LOGIC ---
  const exportToExcel = () => {
    // Tóm tắt chung
    const summaryData = [
      { 'Chỉ số': 'Số lượng CV đã tiếp nhận', 'Giá trị': stats.totalCVs },
      { 'Chỉ số': 'Số lịch phỏng vấn đã tạo', 'Giá trị': stats.totalEmailsSent },
      { 'Chỉ số': 'Tỷ lệ phỏng vấn hoàn thành', 'Giá trị': stats.responseRate },
      { 'Chỉ số': '', 'Giá trị': '' } // Dòng trống ngăn cách
    ];

    // Chi tiết biểu đồ
    const chartDataFormatted = stats.chartData.map(item => ({
      'Thời gian': item.name,
      'CV tiếp nhận': item.blueValue,
      'Lịch phỏng vấn': item.orangeValue,
      'Hoàn thành': item.grayValue
    }));

    // Gộp data
    const finalData = [...summaryData, ...chartDataFormatted];

    // Tạo Worksheet và Workbook
    const ws = XLSX.utils.json_to_sheet(finalData);
    
    // Auto-size columns cơ bản
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thong_Ke");

    // Tải file về máy
    XLSX.writeFile(wb, `Bao_Cao_Thong_Ke_${filterCriteria.replace(' ', '_')}.xlsx`);
  };

  const exportToPDF = async () => {
    const reportElement = document.getElementById("report-client-content");
    if (!reportElement) {
        toast.error("Không tìm thấy nội dung để xuất PDF!");
        return;
    }

    try {
      toast.info("Đang xử lý PDF, vui lòng chờ...", { autoClose: 2000 });
      // html2canvas chụp phần background trắng và scale để nét hơn
      const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: "#f8f9fa" });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bao_Cao_Thong_Ke_${filterCriteria.replace(' ', '_')}.pdf`);
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi xuất PDF: ", error);
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
  // ----------------------

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

      {/* Main Content Area (Khu vực sẽ chụp PDF) */}
      <div id="report-client-content" className="report-content-wrapper">
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
        <button 
          className="btn btn-export-data"
          onClick={() => setShowExportModal(true)}
        >
          Xuất dữ liệu
        </button>
      </div>

      {/* --- MODAL XUẤT DỮ LIỆU --- */}
      {showExportModal && (
        <div className="export-modal-overlay">
          <div className="export-modal">
            {/* Header Modal */}
            <div className="export-modal-header">
              <h5 className="export-modal-title">Xuất dữ liệu thống kê</h5>
              <button 
                className="export-modal-close" 
                onClick={() => setShowExportModal(false)}
                title="Đóng"
              >
                &times;
              </button>
            </div>
            
            {/* Body Modal */}
            <div className="export-modal-body">
              <div className="export-modal-row">
                <label className="export-modal-label">Chọn định dạng :</label>
                <select 
                  className="export-modal-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="export-modal-footer">
              <button 
                className="export-modal-btn export-modal-btn--cancel"
                onClick={() => setShowExportModal(false)}
              >
                Hủy
              </button>
              <button 
                className="export-modal-btn export-modal-btn--download"
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

export default ReportStatistics;
