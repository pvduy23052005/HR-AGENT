# Admin Statistics Implementation Guide

## ✅ HOÀN THÀNH - Các file được tạo/cập nhật

### 1. **Service Layer** 
📁 `frontend/src/services/admin/adminReportService.js`
- ✅ `getSystemStatistics()` - Lấy thống kê hệ thống (tổng hợp từ tất cả HR)
- ✅ `getAllHRs()` - Lấy danh sách tất cả tài khoản HR
- ✅ `exportStatistics()` - Xuất dữ liệu (PDF/Excel)

### 2. **Component Layer**
📁 `frontend/src/pages/admin/statistics/index.jsx` (Main Component)
- ✅ 4 KPI Cards (Tổng CV, Công việc mở, Email gửi, Tỷ lệ AI pass)
- ✅ 3 Filters: 
  - **Lọc theo HR** (Dropdown chứa tất cả HR + "Tất cả")
  - Tiêu chí lọc (Theo tháng/quý/năm)
  - Thời gian (Date picker)
- ✅ Bar Chart (CV tiếp nhận, Lịch phỏng vấn, Hoàn thành)
- ✅ Modal xuất dữ liệu (PDF/Excel)
- ✅ Mock data (sẵn sàng thay bằng API response)

📁 `frontend/src/pages/admin/statistics/AdminStatisticsKPICard.jsx` (Reusable KPI Component)
- ✅ Card hiển thị giá trị KPI với icon, unit, trend
- ✅ Full props customization

### 3. **Styling**
📁 `frontend/src/styles/admin/pages/statistics.css`
- ✅ Layout: 40% (Left: Filters + KPI Cards) | 60% (Right: Chart)
- ✅ Light gray background (#f8f9fa), white cards
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Animations: Modal fade-in, KPI card hover effect
- ✅ Export modal styling (Blue header, Red close button)

---

## 📋 UI/UX Structure

```
┌─────────────────────────────────────────────────────┐
│                    THỐNG KÊ HỆ THỐNG               │
│      Xem báo cáo và phân tích dữ liệu HRM....     │
└─────────────────────────────────────────────────────┘

┌──────────────────────────┬─────────────────────────────┐
│      LEFT (40%)          │        RIGHT (60%)          │
├──────────────────────────┼─────────────────────────────┤
│  ┌────────────────────┐  │  ┌──────────────────────┐   │
│  │   BỘ LỌC          │  │  │  BIỂU ĐỒ THỐNG KÊ   │   │
│  ├────────────────────┤  │  │  (BAR CHART)         │   │
│  │ Lọc theo HR: [▼]  │  │  │                      │   │
│  │ Tiêu chí: [▼]  │  │  │  ████ CV tiếp nhận   │   │
│  │ Thời gian: [YYYY-MM]  │  │  ████ Lịch phỏng vấn │   │
│  └────────────────────┘  │  │  ████ Hoàn thành    │   │
│                          │  │                      │   │
│  ┌────────────────────┐  │  │                      │   │
│  │   KPI CARDS        │  │  │                      │   │
│  ├────────────────────┤  │  │                      │   │
│  │ 👥 Tổng CV: 487   │  │  │                      │   │
│  │ 📌 Công việc: 24  │  │  │                      │   │
│  │ 📧 Email: 1230    │  │  │                      │   │
│  │ ✓ AI pass: 72.5%  │  │  │                      │   │
│  └────────────────────┘  │  └──────────────────────┘   │
└──────────────────────────┴─────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  [Xuất dữ liệu]                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 NEXT STEPS - Backend Integration

### 1. **Backend Endpoints (Cần tạo)**
```javascript
// GET /admin/report/statistics
// Query params: { filterCriteria, filterDate, hrId }
// Return:
{
  success: true,
  data: {
    totalCVsReceived: 487,
    totalOpenJobs: 24,
    totalEmailsSent: 1230,
    cvPassRate: "72.5%",
    chartData: [
      { name: "W1", cvReceived: 45, interviewScheduled: 32, completed: 28 },
      { name: "W2", cvReceived: 52, interviewScheduled: 38, completed: 31 },
      ...
    ]
  }
}

// GET /admin/users?role=HR
// Return danh sách tất cả HR users
{
  success: true,
  data: [
    { id: "1", fullName: "Nguyễn Văn A", email: "hr1@company.com" },
    { id: "2", fullName: "Trần Thị B", email: "hr2@company.com" },
    ...
  ]
}

// GET /admin/report/export
// Query params: { filterCriteria, filterDate, format }
// Return: Binary PDF/Excel file
```

### 2. **Thay Mock Data bằng API**
Tìm dòng `generateMockStats()` trong `index.jsx`, thay:
```javascript
// OLD (Mock):
const mockStats = generateMockStats(filterCriteria, filterDate);
setStats(mockStats);

// NEW (Real API):
const data = response.data;
setStats({
  totalCVsReceived: data.totalCVs || 0,
  totalOpenJobs: data.totalJobs || 0,
  totalEmailsSent: data.totalEmails || 0,
  cvPassRate: data.cvPassRate || '0%',
  chartData: data.chartData || []
});
```

### 3. **Database Aggregation Logic**
Backend cần tính toán:
- **Tổng CV**: `COUNT(candidates)` từ tất cả HR hoặc WHERE `hr_id = selectedHrId`
- **Công việc mở**: `COUNT(jobs WHERE status='open')` (tương tự)
- **Email gửi**: Đếm từ email logs hoặc interview schedules
- **Tỷ lệ AI**: `(passed_ai_screening / total_cv) * 100`
- **Chart Data**: Nhóm theo tuần/tháng, tính `cvReceived`, `interviewScheduled`, `completed`

---

## 💡 Features Highlights

✅ **Dynamic HR Filter Dropdown**
- Tự động load danh sách HR từ database
- Option "Tất cả HR" là default
- Lọc dữ liệu khi chọn HR cụ thể

✅ **4 KPI Cards với Trend Indicators**
- Icon, tiêu đề, giá trị, unit, trend
- Hover effect (lift card, shadow)
- Màu sắc khác nhau per card

✅ **Professional Bar Chart**
- 3 data series: CV tiếp nhận (Blue), Lịch phỏng vấn (Orange), Hoàn thành (Gray)
- Label trên mỗi bar, tooltip, legend
- Responsive container

✅ **Export Modal**
- Chọn format (PDF/Excel)
- Xuất tóm tắt KPI + chart data
- File name: `Thong_Ke_Admin_YYYY-MM-DD.{pdf,xlsx}`

✅ **Responsive Design**
- Desktop: 40/60 layout
- Tablet (< 1200px): 45/55
- Mobile (< 992px): Stacked (100% chiều rộng)

---

## 🎨 Styling Notes

| Element | Color | Font Weight |
|---------|-------|------------|
| Page BG | #f8f9fa (Light Gray) | - |
| Cards | White (#fff) | - |
| Title | #212529 (Dark) | 700 |
| Subtitle | #6c757d (Gray) | 400 |
| Labels | #495057 (Medium Gray) | 600 |
| KPI Value | #212529 (Dark) | 700 |
| KPI Card Left Border | Per Color (#0d6efd, #198754, #fd7e14, #6f42c1) | - |

---

## 📦 Import Dependencies (Already Added)

- ✅ react-icons (FiUsers, FiBriefcase, FiMail, MdCheckCircle)
- ✅ recharts (BarChart, Bar, XAxis, YAxis, etc.)
- ✅ xlsx (Excel export)
- ✅ jspdf + html2canvas (PDF export)
- ✅ react-toastify (Toast notifications)

---

## 🚀 Testing Checklist

- [ ] Filters work (HR dropdown, filter criteria, date picker)
- [ ] KPI cards display with correct values
- [ ] Chart renders with 3 bar series
- [ ] Export Modal opens/closes
- [ ] Excel export works
- [ ] PDF export works
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors

---

## 📝 Notes

1. **Mock data hiện tại**: Generate trong `generateMockStats()` - giúp test UI trước khi backend ready
2. **HR List**: Fetch tự động khi component mount
3. **Auto-refresh**: Re-fetch khi thay đổi filter
4. **Chart Export**: Sử dụng html2canvas để capture visual, ideal cho PDF
5. **Locale**: Tất cả text đã dùng tiếng Việt, có thể dễ dàng thay đổi

---

## 📞 Support
Nếu cần chỉnh sửa:
- Thay đổi MVP/metrics → Sửa trong KPI cards
- Thay đổi chart type → Thay BarChart bằng LineChart/AreaChart
- Thêm filter mới → Thêm div.admin-filter-row + state
- Thay đổi màu sắc → Sửa trong statistics.css

Chúc mừng! Admin Statistics page sẵn sàng 🎉
