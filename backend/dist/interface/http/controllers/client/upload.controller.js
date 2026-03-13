"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCV = void 0;
const upload_cv_use_case_1 = require("../../../../application/use-cases/client/upload/upload-cv.use-case");
const candidate_repository_1 = require("../../../../infrastructure/database/repositories/client/candidate.repository");
const job_repository_1 = require("../../../../infrastructure/database/repositories/client/job.repository");
const upload_service_1 = require("../../../../infrastructure/external-service/upload.service");
const gemini_service_1 = require("../../../../infrastructure/external-service/gemini.service");
const candidateRepository = new candidate_repository_1.CandidateRepository();
const jobRepository = new job_repository_1.JobRepository();
const uploadService = new upload_service_1.UploadService();
const geminiService = new gemini_service_1.GeminiService();
const uploadCVUseCase = new upload_cv_use_case_1.UploadCVUseCase(candidateRepository, jobRepository, uploadService, geminiService);
const uploadCV = async (req, res) => {
    try {
        const userID = res.locals.user.id;
        const file = req.file;
        const { jobID } = req.body;
        const { cvLink, newCandidate, dataCV } = await uploadCVUseCase.execute(userID, jobID, file);
        res.status(200).json({ message: 'CV processed successfully', cvLink, newCandidate, dataCV });
    }
    catch (error) {
        const e = error;
        const statusCode = e.message?.includes('Vui lòng') ? 400 : 500;
        res.status(statusCode).json({ message: e.message });
    }
};
exports.uploadCV = uploadCV;
//# sourceMappingURL=upload.controller.js.map