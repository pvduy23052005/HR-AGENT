"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const get_statistics_use_case_1 = require("../../../../application/use-cases/client/report/get-statistics.use-case");
class ReportController {
    getStatisticsUseCase;
    constructor() {
        this.getStatisticsUseCase = new get_statistics_use_case_1.GetStatisticsUseCase();
    }
    getStatistics = async (req, res) => {
        try {
            // User is injected by authMiddleware into res.locals.user
            const userId = res.locals.user?.id || res.locals.user?._id;
            const { filterCriteria, filterDate } = req.query;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized, user ID not found' });
                return;
            }
            const reportData = await this.getStatisticsUseCase.execute(userId.toString(), filterCriteria, filterDate);
            res.status(200).json({
                success: true,
                data: reportData,
            });
        }
        catch (error) {
            console.error('Error getting statistics:', error);
            res.status(500).json({ success: false, message: 'Internal server error while fetching stats' });
        }
    };
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map