import { Router } from "express";
import * as controller from "../../controllers/admin/statistics.controller";

const router = Router();

// GET /admin/report/statistics - Lấy thống kê hệ thống
router.get("/statistics", controller.getSystemStatistics);

// GET /admin/users - Lấy danh sách HR
router.get("/users", controller.getAllHRs);

// GET /admin/report/export - Xuất dữ liệu
router.get("/export", controller.exportStatistics);

export const statisticsRoute = router;
