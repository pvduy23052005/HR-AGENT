# Implement Candidate Sourcing Frontend

This plan outlines the steps and code changes needed to create the Candidate Sourcing interface, integrating it with the completed backend endpoints.

## User Review Required
Please review the proposed UI components, routing, and sidebar integration. Does this structure and design aligned with your expectations? 

> [!NOTE]
> 1. We'll use CSS based on the existing `candidateManagement.css` to maintain visual consistency.
> 2. We'll add a new icon `MdPersonSearch` from `react-icons/md` for the sidebar.
> 3. Does the Sourcing page need to allow pushing a lead directly to the main Candidate or is updating status enough? Currently the API only has `updateLeadStatus`.

## Proposed Changes

### Configuration & Routing

#### [MODIFY] [index.jsx](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/routes/index.jsx)
- Import the new `Sourcing` component.
- Add `{ path: "sourcing", element: <Sourcing /> }` to the children array under [LayoutClientDefault](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/layouts/client/layoutClientDefault.jsx#6-19).

#### [MODIFY] [index.jsx](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/components/clients/siderbar/index.jsx)
- Import `MdPersonSearch` (or similar) from `react-icons/md`.
- Add `{ path: "/sourcing", icon: <MdPersonSearch />, label: "Sourcing Ứng viên" }` to the `menuItems` array so it appears on the sidebar.

---

### API Services

#### [NEW] [sourcingService.js](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/services/client/sourcingService.js)
- Create Axios calls to the backend API:
  - `searchCandidates(payload)` -> `POST /sourcing/search`
  - `getLeads(params)` -> `GET /sourcing/leads`
  - `updateLeadStatus(id, status)` -> `PATCH /sourcing/leads/:id/status`
  - `deleteLead(id)` -> `DELETE /sourcing/leads/:id`

---

### Pages & Styling

#### [NEW] [sourcing.css](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/styles/client/pages/sourcing.css)
- Create styles to match the application's aesthetic. We will reuse design patterns from `candidateManagement.css` (e.g., table layouts, filters, buttons, pagination).

#### [NEW] [Sourcing.jsx](file:///Users/nganh.cc/Desktop/HR-AGENT/frontend/src/pages/client/Sourcing/Sourcing.jsx)
- Build the main React component.
- **Top Section**: Header and Sourcing Form (Input keyword, Select source, "Tiến hành quét" button).
- **Filter Section**: Filter existing leads by keyword/status.
- **Data Table**: Render leads with columns:
  - Tên / Chức danh (Name / Title)
  - Nguồn (Source - LinkedIn/Github)
  - Link Hồ sơ (Profile URL)
  - Trạng thái (Status - e.g. new, contacted, rejected)
  - Ngày tạo (Created At)
  - Thao tác (Actions - Edit Status, Delete)
- Implement pagination and connect to `sourcingService`.

## Verification Plan

### Automated Tests
- This project doesn't seem to have frontend unit tests setup. Integration will be verified manually.
- Can run `npm run build` to ensure no Typescript/Vite build errors occur.

### Manual Verification
1. Run the frontend (`npm run dev`) and backend.
2. Login and navigate to the Sourcing page via the sidebar.
3. Test the **Sourcing** button to see if it calls the `[POST] /sourcing/search` API and handles loading state.
4. Verify the **table** loads sourced leads from `[GET] /sourcing/leads`.
5. Test the **Delete** button to verify `[DELETE] /sourcing/leads/:id` works and updates UI.
6. Test the **Status Update** feature to verify `[PATCH] /sourcing/leads/:id/status`.
7. Verify styling matches the rest of the application.
