"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoute = void 0;
const express_1 = require("express");
const report_controller_1 = require("../../controllers/client/report.controller");
const router = (0, express_1.Router)();
const reportController = new report_controller_1.ReportController();
router.get('/statistics', reportController.getStatistics);
exports.reportRoute = router;
//# sourceMappingURL=report.route.js.map