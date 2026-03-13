"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCandidate = void 0;
const executeAiAnalyize_use_case_1 = require("../../../../application/use-cases/client/aiAnalyize/executeAiAnalyize.use-case");
const candidate_repository_1 = require("../../../../infrastructure/database/repositories/client/candidate.repository");
const job_repository_1 = require("../../../../infrastructure/database/repositories/client/job.repository");
const aiAnalyize_repository_1 = require("../../../../infrastructure/database/repositories/client/aiAnalyize.repository");
const gemini_service_1 = require("../../../../infrastructure/external-service/gemini.service");
const candidateRepository = new candidate_repository_1.CandidateRepository();
const jobRepository = new job_repository_1.JobRepository();
const aiAnalyzeRepository = new aiAnalyize_repository_1.AiAnalysisRepository();
const geminiService = new gemini_service_1.GeminiService();
const executeAiAnalyizeUseCase = new executeAiAnalyize_use_case_1.ExecuteAiAnalyizeUseCase(candidateRepository, jobRepository, aiAnalyzeRepository, geminiService);
const analyzeCandidate = async (req, res) => {
    try {
        const { jobID, candidateID } = req.body;
        const result = await executeAiAnalyizeUseCase.execute(candidateID, jobID);
        res.status(200).json({ success: true, aiAnalyize: result.data, message: result.message });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi hệ thống khi phân tích AI.' });
    }
};
exports.analyzeCandidate = analyzeCandidate;
//# sourceMappingURL=aiAnalyize.controller.js.map