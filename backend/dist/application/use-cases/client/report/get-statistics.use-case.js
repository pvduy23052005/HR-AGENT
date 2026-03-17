"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatisticsUseCase = void 0;
const candidate_model_1 = __importDefault(require("../../../../infrastructure/database/models/candidate.model"));
const interviewSchedule_model_1 = __importDefault(require("../../../../infrastructure/database/models/interviewSchedule.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class GetStatisticsUseCase {
    async execute(userId, filterCriteria, filterDate) {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // ── Parse filterDate ─────────────────────────────────────────────────────
        // filterDate format: "2026-03" (month picker from frontend)
        const [yearStr, monthStr] = (filterDate ?? '').split('-');
        const year = parseInt(yearStr ?? String(new Date().getFullYear()), 10);
        const month = parseInt(monthStr ?? String(new Date().getMonth() + 1), 10);
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 1); // exclusive
        // ── 1. Total CVs by this user (all time for the stat card) ────────────────
        const totalCVs = await candidate_model_1.default.countDocuments({ addedBy: userObjectId });
        // ── 2. Interviews linked to this user (all time) ──────────────────────────
        const totalInterviews = await interviewSchedule_model_1.default.countDocuments({ userId: userObjectId });
        // ── 3. Completed interviews ───────────────────────────────────────────────
        const totalCompleted = await interviewSchedule_model_1.default.countDocuments({
            userId: userObjectId,
            status: 'completed',
        });
        // Response rate = completed / totalCVs
        const responseRate = totalCVs > 0
            ? `${Math.round((totalCompleted / totalCVs) * 100)}%`
            : '0%';
        // ── 4. Weekly chart data for selected month ───────────────────────────────
        // Group CVs by ISO week number (1-4) within the month
        const cvsByWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
        const interviewsByWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
        const completedByWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
        const getWeek = (date) => {
            const day = date.getDate();
            if (day <= 7)
                return 1;
            if (day <= 14)
                return 2;
            if (day <= 21)
                return 3;
            return 4;
        };
        // CVs in this month
        const cvsThisMonth = await candidate_model_1.default.find({
            addedBy: userObjectId,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        }).select('createdAt').lean();
        for (const cv of cvsThisMonth) {
            const w = getWeek(new Date(cv.createdAt));
            cvsByWeek[w] = (cvsByWeek[w] ?? 0) + 1;
        }
        // Interviews in this month
        const interviewsThisMonth = await interviewSchedule_model_1.default.find({
            userId: userObjectId,
            time: { $gte: startOfMonth, $lt: endOfMonth },
        }).select('time status').lean();
        for (const iv of interviewsThisMonth) {
            const w = getWeek(new Date(iv.time));
            interviewsByWeek[w] = (interviewsByWeek[w] ?? 0) + 1;
            if (iv.status === 'completed') {
                completedByWeek[w] = (completedByWeek[w] ?? 0) + 1;
            }
        }
        const chartData = [1, 2, 3, 4].map((w) => ({
            name: `Tuần ${w}`,
            blueValue: cvsByWeek[w], // CV tiếp nhận
            orangeValue: interviewsByWeek[w], // Lịch phỏng vấn
            grayValue: completedByWeek[w], // Phỏng vấn hoàn thành
        }));
        return {
            totalCVs,
            totalEmailsSent: totalInterviews, // dùng tổng interview như proxy "emails gửi"
            responseRate,
            chartData,
        };
    }
}
exports.GetStatisticsUseCase = GetStatisticsUseCase;
//# sourceMappingURL=get-statistics.use-case.js.map