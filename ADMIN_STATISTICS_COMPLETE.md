# 📊 Admin Statistics Implementation - Complete Guide

## ✅ What's Done

### Backend (Express + TypeScript)
- ✅ **Controllers** ([`statistics.controller.ts`](backend/src/interface/http/controllers/admin/statistics.controller.ts))
  - `getSystemStatistics()` - Returns aggregated stats from all HRs
  - `getAllHRs()` - Returns list of all HR users
  - `exportStatistics()` - Handles export requests

- ✅ **Routes** ([`statistics.route.ts`](backend/src/interface/http/routes/admin/statistics.route.ts))
  - `GET /admin/report/statistics` - System statistics
  - `GET /admin/report/users` - HR users list
  - `GET /admin/report/export` - Export endpoint

- ✅ **Integration** ([`admin/index.route.ts`](backend/src/interface/http/routes/admin/index.route.ts))
  - Statistics routes registered at `/admin/report/*`
  - Protected with `authMiddleware`

### Frontend (React + Vite)
- ✅ **Service** ([`adminReportService.js`](frontend/src/services/admin/adminReportService.js))
  - `getSystemStatistics()` - Fetch system stats with error handling
  - `getAllHRs()` - Fetch HR list
  - `exportStatistics()` - Export handler

- ✅ **Main Component** ([`statistics/index.jsx`](frontend/src/pages/admin/statistics/index.jsx))
  - 4 KPI Cards with icons & trends
  - 3 Filters: HR dropdown + Criteria + Date picker
  - Bar Chart with 3 data series
  - Export modal (PDF/Excel)
  - Proper state management & error handling

- ✅ **KPI Card Component** ([`AdminStatisticsKPICard.jsx`](frontend/src/pages/admin/statistics/AdminStatisticsKPICard.jsx))
  - Reusable KPI display component
  - Customizable colors, icons, values

- ✅ **Styling** ([`styles/admin/pages/statistics.css`](frontend/src/styles/admin/pages/statistics.css))
  - 40/60 layout (Filters & KPI | Chart)
  - Light gray background, white cards
  - Responsive (desktop, tablet, mobile)
  - Smooth animations & hover effects

---

## 🚀 How to Test

### 1️⃣ Start Backend
```bash
cd backend
pnpm dev  # or npm run dev
```
Backend runs at `http://localhost:5050`

### 2️⃣ Start Frontend
```bash
cd frontend
pnpm dev  # or npm run dev
```
Frontend runs at `http://localhost:5173`

### 3️⃣ Navigate to Admin Statistics
```
URL: http://localhost:5173/admin/statistics
```

### 4️⃣ Test Features

#### Test HR Filter Dropdown
1. Open browser DevTools → Network tab
2. Change "Lọc theo HR" dropdown
3. Observe:
   - API call to `/admin/report/users` (loads HR list)
   - API call to `/admin/report/statistics` (with optional `hrId` param)

#### Test Filters & Refresh
1. Change "Tiêu chí lọc" (Theo tháng/quý/năm)
2. Change "Thời gian" (date picker)
3. Observe: Data refreshes automatically via `fetchStatistics()`

#### Test KPI Cards
- Should show 4 cards with values, icons, units, and trend indicators
- Cards should have hover effect (lift + shadow)

#### Test Bar Chart
- Should render 3 colored bars per data point:
  - 🔵 Blue = CV tiếp nhận
  - 🟠 Orange = Lịch phỏng vấn
  - ⚫ Gray = Hoàn thành

#### Test Export
1. Click "Xuất dữ liệu" button
2. Modal appears with format selector
3. Choose "Excel" → Click "Tải xuống"
   - File downloads as `Thong_Ke_Admin_YYYY-MM-DD.xlsx`
4. Choose "PDF" → Click "Tải xuống"
   - File downloads as `Thong_Ke_Admin_YYYY-MM-DD.pdf`

#### Test Errors
1. Stop backend server
2. Try loading stats
3. Should show error toast & fallback to empty state
4. Start backend again → Auto-refresh works

---

## 📋 API Endpoints Reference

### System Statistics
```
GET /admin/report/statistics?filterCriteria=Theo%20tháng&filterDate=2026-03&hrId=null
```
**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Lấy thống kê hệ thống thành công!",
  "data": {
    "totalCVsReceived": 487,
    "totalOpenJobs": 24,
    "totalEmailsSent": 1230,
    "cvPassRate": "72.5%",
    "chartData": [
      { "name": "W1", "cvReceived": 45, "interviewScheduled": 32, "completed": 28 },
      { "name": "W2", "cvReceived": 52, "interviewScheduled": 38, "completed": 31 }
    ]
  }
}
```

### Get HR List
```
GET /admin/report/users?role=HR
```
**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Lấy danh sách HR thành công!",
  "data": [
    {
      "id": "1",
      "fullName": "Nguyễn Văn A",
      "email": "hr1@company.com",
      "role": "HR",
      "status": "active"
    }
  ]
}
```

### Export Data
```
GET /admin/report/export?filterCriteria=Theo%20tháng&filterDate=2026-03&format=excel
```
**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Xuất dữ liệu thành công!",
  "data": {
    "fileName": "Thong_Ke_Admin_2026-03.xlsx",
    "url": "/exports/Thong_Ke_Admin_2026-03.xlsx"
  }
}
```

---

## 🔄 Data Flow

```
Frontend Component
    ↓
1. useEffect: fetchHRList() + fetchStatistics()
    ↓
2. renderToDOM
    ↓
3. User interacts (change filter/date)
    ↓
4. setFilterCriteria/setFilterDate/setSelectedHr
    ↓
5. useEffect triggers fetchStatistics()
    ↓
Service Layer (adminReportService)
    ↓
API Call (axios)
    ↓
Backend Route (/admin/report/statistics)
    ↓
Controller (getSystemStatistics)
    ↓
Return Mock Data (currently) or DB Query (when implemented)
    ↓
Frontend receives response
    ↓
setStats(data) → Component re-renders
```

---

## 📝 Integration Checklist

- [x] Backend routes created
- [x] Frontend components created
- [x] Error handling added
- [x] Styling complete
- [x] Export functionality (client-side)
- [ ] **TODO: Replace Mock Data with Real Database Queries**
  - [ ] Connect to MongoDB/SQL for CV counts
  - [ ] Aggregate data by HR account
  - [ ] Calculate AI pass rates
  - [ ] Generate chart data from interviews
  
- [ ] **TODO: Backend Export (Optional)**
  - [ ] Generate server-side PDF/Excel with npm packages
  - [ ] Stream file downloads

- [ ] **TODO: Advanced Features**
  - [ ] Add date range selector (instead of month picker)
  - [ ] Real-time updates via WebSocket
  - [ ] Export schedules/automations
  - [ ] Add more chart types (line, pie, etc.)

---

## 🎨 Component Structure

```
AdminStatistics (index.jsx)
├── Header (Title + Subtitle)
├── Main Content
│   ├── Left Column (40%)
│   │   ├── Filters Card
│   │   │   ├── HR Dropdown
│   │   │   ├── Criteria Select
│   │   │   └── Date Picker
│   │   └── KPI Grid
│   │       ├── AdminStatisticsKPICard (CV)
│   │       ├── AdminStatisticsKPICard (Jobs)
│   │       ├── AdminStatisticsKPICard (Emails)
│   │       └── AdminStatisticsKPICard (AI Pass)
│   └── Right Column (60%)
│       └── Chart Card
│           └── BarChart (Recharts)
├── Footer
│   └── Export Button
└── Export Modal
    ├── Header
    ├── Format Selector
    └── Action Buttons
```

---

## 🛠️ Files Created/Modified

| File | Type | Purpose |
|------|------|---------|
| `backend/src/interface/http/controllers/admin/statistics.controller.ts` | NEW | Three controller methods |
| `backend/src/interface/http/routes/admin/statistics.route.ts` | NEW | Route definitions |
| `backend/src/interface/http/routes/admin/index.route.ts` | MODIFIED | Register statistics routes |
| `frontend/src/services/admin/adminReportService.js` | NEW | API service with error handling |
| `frontend/src/pages/admin/statistics/index.jsx` | MODIFIED | Full component implementation |
| `frontend/src/pages/admin/statistics/AdminStatisticsKPICard.jsx` | NEW | KPI card component |
| `frontend/src/styles/admin/pages/statistics.css` | NEW | Complete styling |
| `ADMIN_STATISTICS_IMPLEMENTATION.md` | NEW | Implementation doc |

---

## 💡 Key Features

✅ **Dynamic HR Filtering**
- Dropdown auto-loads from API
- Filter data by specific HR or all HRs

✅ **Responsive Design**
- Desktop: 40% left, 60% right
- Mobile: Stacked vertical layout
- Smooth animations

✅ **Professional UI**
- 4 KPI cards with icons & trends
- Clean 2-column layout
- Consistent color scheme
- Hover effects

✅ **Data Visualization**
- 3-series bar chart using Recharts
- Data labels on bars
- Interactive tooltips

✅ **Export Capability**
- PDF export (html2canvas + jsPDF)
- Excel export (XLSX)
- Includes KPI summary + chart data

✅ **Error Handling**
- Try/catch on all API calls
- User-friendly error messages
- Fallback states for empty data

---

## 📊 Sample Data (Currently Mocked)

When backend is ready, replace mock data in `statistics.controller.ts`:

```typescript
// TODO: Database queries like:
const cvCount = await db.candidates.countDocuments({
  createdAt: { $gte: startDate, $lte: endDate },
  ...(hrId ? { hrId } : {})
});

const jobCount = await db.jobs.countDocuments({
  status: 'open',
  ...(hrId ? { hrId } : {})
});

const passRate = (passedCount / totalCount * 100).toFixed(1) + '%';

const chartData = await db.candidates.aggregate([
  {
    $group: {
      _id: { $week: '$createdAt' },
      cvReceived: { $sum: 1 },
      interviewScheduled: { $sum: { $cond: ['$interviewDate', 1, 0] } },
      completed: { $sum: { $cond: ['$interviewCompleted', 1, 0] } }
    }
  },
  { $sort: { _id: 1 } }
]);
```

---

## 🚨 Known Limitations (Current Iteration)

1. **Mock Data**: Statistics use hardcoded values
   - Solution: Connect to actual database

2. **No Real-time Updates**: Data doesn't auto-refresh
   - Solution: Add WebSocket or polling

3. **Limited Filters**: Only HR + date filter
   - Solution: Add job category, recruiter filters

4. **Single Chart Type**: Only Bar chart
   - Solution: Add Line, Pie, Area charts

5. **Server-side Export Not Implemented**: Frontend generates PDF/Excel
   - Solution: Implement backend export with proper formatting

---

## 📞 Support & Troubleshooting

### Issue: "Cannot GET /admin/report/statistics"
**Solution:** Make sure backend server is running & routes are registered

### Issue: "HR dropdown is empty"
**Solution:** Check browser DevTools Network tab for `/admin/report/users` response

### Issue: "Export button doesn't work"
**Solution:** Ensure `html2canvas` and `xlsx` packages are installed

### Issue: "Charts not rendering"
**Solution:** Check console for Recharts errors, verify data format

---

## 🎉 Ready to Use!

All components are fully functional and ready to integrate with real backend data.
Once database queries are implemented, this page will display live system-wide statistics!

**Next Steps:**
1. Connect to your database
2. Implement real aggregation queries
3. Test with production data
4. Deploy to staging/production

Happy coding! 🚀
