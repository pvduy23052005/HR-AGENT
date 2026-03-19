# 🚀 Admin Statistics - Quick Start Checklist

## ✅ Setup Complete - What You Have

### Backend Files
- ✅ Controller: `backend/src/interface/http/controllers/admin/statistics.controller.ts`
  - `getSystemStatistics()` - Returns stats
  - `getAllHRs()` - Returns HR list
  - `exportStatistics()` - Export handler

- ✅ Routes: `backend/src/interface/http/routes/admin/statistics.route.ts`
  - GET /admin/report/statistics
  - GET /admin/report/users
  - GET /admin/report/export

- ✅ Integrated: `backend/src/interface/http/routes/admin/index.route.ts`
  - Statistics routes registered at `/admin/report/*`

### Frontend Files
- ✅ Service: `frontend/src/services/admin/adminReportService.js`
- ✅ Component: `frontend/src/pages/admin/statistics/index.jsx`
- ✅ KPI Card: `frontend/src/pages/admin/statistics/AdminStatisticsKPICard.jsx`
- ✅ Styles: `frontend/src/styles/admin/pages/statistics.css`

---

## 🧪 Test It Right Now

### Step 1: Start Backend
```bash
cd backend
pnpm dev
```
Wait for: `Backend admin đang chạy tại: http://localhost:5050`

### Step 2: Start Frontend
```bash
cd frontend
pnpm dev
```
Wait for: `Local: http://localhost:5173`

### Step 3: Open in Browser
```
http://localhost:5173/admin/statistics
```

### Step 4: Verify Features

✅ **Page Loads**
- Title: "Thống kê hệ thống"
- Subtitle: "Xem báo cáo..."

✅ **Left Column**
- 3 Filters visible (HR dropdown, Filter criteria, Date picker)
- 4 KPI Cards display (CV, Jobs, Emails, AI Pass)
- Values visible: 487, 24, 1230, 72.5%

✅ **Right Column**
- Bar chart renders with data
- 3 colored bars (Blue, Orange, Gray)
- Legend shows: CV tiếp nhận, Lịch phỏng vấn, Hoàn thành

✅ **Bottom**
- "Xuất dữ liệu" button visible

✅ **Interactivity**
- Click HR dropdown → "Tất cả HR", "Nguyễn Văn A", etc.
- Change filter criteria → Data reloads
- Change date → Data reloads
- Click Export → Modal appears

✅ **Export**
- Choose "Excel" → "Tải xuống" → File downloads
- Choose "PDF" → "Tải xuống" → File downloads

---

## 📊 Browser DevTools Check

Open `F12 → Network Tab` and verify:

1. **When page loads:**
   - Request: `GET /admin/report/users` → 200 OK
   - Request: `GET /admin/report/statistics` → 200 OK

2. **When you change HR filter:**
   - New request: `GET /admin/report/statistics?...&hrId=1` → 200 OK

3. **When you change date:**
   - New request: `GET /admin/report/statistics?filterDate=2026-04` → 200 OK

All responses should have:
```json
{
  "success": true,
  "code": 200,
  "data": {...}
}
```

---

## 🎯 What's Working Today

| Feature | Status | Notes |
|---------|--------|-------|
| Page loads | ✅ | Component renders without errors |
| HR Filter | ✅ | Dropdown loads mock HR data |
| Date filters | ✅ | Month picker works |
| 4 KPI Cards | ✅ | Display mock values |
| Bar Chart | ✅ | Renders 3 data series |
| Export Modal | ✅ | Opens/closes smoothly |
| Excel Export | ✅ | Downloads file client-side |
| PDF Export | ✅ | Downloads file client-side |
| Error Handling | ✅ | Shows toast notifications |
| Responsive | ✅ | Works on mobile/tablet |

---

## 📝 What's Mock (To Replace Later)

The following use **hardcoded mock data** in `statistics.controller.ts`:

```typescript
// Current mock values:
- totalCVsReceived: 487
- totalOpenJobs: 24
- totalEmailsSent: 1230
- cvPassRate: '72.5%'
- chartData: [W1, W2, W3, W4 hardcoded]

// HR list: 4 mock HRs with fake data
```

**To replace with real data:**
Replace the mock arrays in `statistics.controller.ts` with actual database queries:
```typescript
// Example (pseudocode):
const cvCount = await Candidate.countDocuments({ ...filters });
const jobs = await Job.find({ status: 'open' });
const chartData = await aggregateByWeek(...);
```

---

## 🔧 Common Issues & Solutions

### ❌ "Page is blank / shows error"
- Check browser console (F12)
- Backend running? (http://localhost:5050)
- Network tab → see if `/admin/report/` calls fail?
- → Start backend with `pnpm dev`

### ❌ "HR dropdown is empty"
- Check if `/admin/report/users` request succeeds
- Should return 4 mock HRs
- If fails → Backend connection issue

### ❌ "Chart doesn't show"
- Check if `/admin/report/statistics` returns data
- Verify response has `chartData` array
- If empty → Check mock data in controller

### ❌ "Export doesn't download"
- Check browser's download settings
- Excel/PDF should download to Downloads folder
- File name: `Thong_Ke_Admin_YYYY-MM-DD.{xlsx|pdf}`

### ❌ "Styles look broken"
- Clear browser cache: `Ctrl+Shift+Delete`
- Reload: `Ctrl+Shift+R`
- CSS file should be at: `frontend/src/styles/admin/pages/statistics.css`

---

## 📦 Dependencies (All Installed)

```json
{
  "recharts": "^3.8.0",      // Charts
  "html2canvas": "^1.4.1",   // PDF generation
  "jspdf": "^4.2.1",         // PDF
  "xlsx": "^0.18.5",         // Excel
  "react-toastify": "^11.0.5", // Notifications
  "react-icons": "^5.5.0"    // Icons
}
```

All are already in `frontend/package.json` ✅

---

## 🎨 UI/UX Specs

- **Layout**: 40% left (Filters+KPIs) | 60% right (Chart)
- **Colors**:
  - Background: #f8f9fa (light gray)
  - Cards: #ffffff (white)
  - Blue: #0d6efd (Primary)
  - Orange: #fd7e14 (Charts)
  - Gray: #6c757d (Neutral)

- **Responsive Breakpoints**:
  - Desktop (> 1200px): 40/60 split
  - Tablet (< 1200px): 45/55 split
  - Mobile (< 992px): 100% stacked

---

## 📞 Next Steps

### Option A: Keep Using Mock Data
- Everything works as-is
- Good for UI/UX testing
- Data refreshes on filter changes

### Option B: Connect to Real Database
1. Update `statistics.controller.ts`:
   - Replace mock arrays with DB queries
   - Use Mongoose/Sequelize/TypeORM
   - Calculate aggregations in DB

2. Test each endpoint:
   - `/admin/report/statistics`
   - `/admin/report/users`

3. Verify response format matches API spec

### Option C: Add More Features (Future)
- Real-time WebSocket updates
- Custom date ranges
- More chart types
- Server-side export with formatting
- Dashboard widgets

---

## ✨ You're All Set!

**The Admin Statistics page is fully functional and ready to use.**

- Frontend: ✅ Complete & responsive
- Backend: ✅ Routes & controllers ready
- Data: 🔄 Mock data (can easily swap to real DB)
- Export: ✅ PDF & Excel working
- Error Handling: ✅ User-friendly messages
- Styling: ✅ Professional & responsive

**Start the servers and test it now! 🚀**

```bash
# Terminal 1 - Backend
cd backend && pnpm dev

# Terminal 2 - Frontend
cd frontend && pnpm dev

# Browser
http://localhost:5173/admin/statistics
```

Enjoy! 🎉
