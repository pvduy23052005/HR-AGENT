"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteAiAnalyizeUseCase = void 0;
class ExecuteAiAnalyizeUseCase {
    candidateRepo;
    jobRepo;
    aiAnalyizeRepo;
    geminiService;
    constructor(candidateRepo, jobRepo, aiAnalyizeRepo, geminiService) {
        this.candidateRepo = candidateRepo;
        this.jobRepo = jobRepo;
        this.aiAnalyizeRepo = aiAnalyizeRepo;
        this.geminiService = geminiService;
    }
    async execute(candidateID, jobID) {
        const existingAnalysis = await this.aiAnalyizeRepo.getAnalysisByCandidateId(candidateID);
        if (existingAnalysis) {
            return {
                message: 'Hồ sơ ứng viên này đã được phân tích.',
                data: existingAnalysis.getDetail(),
            };
        }
        const candidate = await this.candidateRepo.getCandidateById(candidateID);
        if (!candidate)
            throw new Error('Không tìm thấy thông tin ứng viên.');
        const job = await this.jobRepo.getJobById(jobID);
        if (!job)
            throw new Error('Không tìm thấy thông tin công việc (Job).');
        const analysisResult = await this.geminiService.analyzeCandidateWithJob(candidate.getDetailProfile(), job.getDetailJob());
        if (!analysisResult)
            throw new Error('Lỗi khi gọi AI phân tích dữ liệu.');
        const savedAnalysis = await this.aiAnalyizeRepo.createAiAnalysis({
            jobID,
            candidateID,
            summary: analysisResult['summary'],
            matchingScore: analysisResult['matchingScore'],
            redFlags: analysisResult['redFlags'],
            suggestedQuestions: analysisResult['suggestedQuestions'],
        });
        if (!savedAnalysis)
            throw new Error('Lỗi khi lưu kết quả phân tích.');
        await this.candidateRepo.updateStatus(candidateID, { status: "analyzed" });
        return {
            message: 'Phân tích AI hoàn tất thành công.',
            data: savedAnalysis.getDetail(),
        };
    }
}
exports.ExecuteAiAnalyizeUseCase = ExecuteAiAnalyizeUseCase;
//# sourceMappingURL=executeAiAnalyize.use-case.js.map