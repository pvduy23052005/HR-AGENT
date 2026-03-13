"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleInterview = void 0;
const schedule_interview_use_case_1 = require("../../../../application/use-cases/client/interview/schedule-interview.use-case");
const aiAnalyize_repository_1 = require("../../../../infrastructure/database/repositories/client/aiAnalyize.repository");
const candidate_repository_1 = require("../../../../infrastructure/database/repositories/client/candidate.repository");
const interviewSchedule_repository_1 = require("../../../../infrastructure/database/repositories/client/interviewSchedule.repository");
const job_repository_1 = require("../../../../infrastructure/database/repositories/client/job.repository");
const gemini_service_1 = require("../../../../infrastructure/external-service/gemini.service");
const mail_service_1 = require("../../../../infrastructure/external-service/mail.service");
const candidateRepository = new candidate_repository_1.CandidateRepository();
const jobRepository = new job_repository_1.JobRepository();
const aiAnalysisRepository = new aiAnalyize_repository_1.AiAnalysisRepository();
const interviewScheduleRepository = new interviewSchedule_repository_1.InterviewScheduleRepository();
const geminiService = new gemini_service_1.GeminiService();
const mailService = new mail_service_1.MailService();
const scheduleInterviewUseCase = new schedule_interview_use_case_1.ScheduleInterviewUseCase(candidateRepository, jobRepository, aiAnalysisRepository, interviewScheduleRepository, geminiService, mailService);
// [POST] /interview/schedule
const scheduleInterview = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { candidateID, jobID, time, durationMinutes, address, notes } = req.body;
        const result = await scheduleInterviewUseCase.execute({
            userId,
            candidateID,
            jobID,
            time: new Date(time),
            durationMinutes: durationMinutes ?? 60,
            address,
            notes,
        });
        res.status(201).json({
            success: true,
            message: 'Đặt lịch phỏng vấn thành công.',
            schedule: result.schedule,
            emailSent: result.emailSent,
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi đặt lịch phỏng vấn.' });
    }
};
exports.scheduleInterview = scheduleInterview;
//# sourceMappingURL=interview.controller.js.map