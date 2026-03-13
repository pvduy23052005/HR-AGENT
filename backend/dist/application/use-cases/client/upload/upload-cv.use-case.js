"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCVUseCase = void 0;
class UploadCVUseCase {
    candidateRepo;
    jobRepo;
    uploadSvc;
    geminiSvc;
    constructor(candidateRepo, jobRepo, uploadSvc, geminiSvc) {
        this.candidateRepo = candidateRepo;
        this.jobRepo = jobRepo;
        this.uploadSvc = uploadSvc;
        this.geminiSvc = geminiSvc;
    }
    async execute(userID, jobID, file) {
        if (!file)
            throw new Error('No file uploaded');
        const job = await this.jobRepo.getJobById(jobID);
        if (!job)
            throw new Error('Công việc không đúng');
        const fileUrls = await this.uploadSvc.uploadCloud([file]);
        if (!fileUrls || fileUrls.length === 0)
            throw new Error('Upload CV thất bại');
        const cvLink = fileUrls[0];
        let dataCV = {
            jobID,
            addedBy: userID,
            personal: { cvLink },
        };
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            console.log('Đang ném file cho Gemini làm OCR...');
            const extractedData = await this.geminiSvc.extractCV(file.buffer, file.mimetype);
            if (extractedData) {
                const personal = extractedData['personal'] ?? {};
                dataCV = {
                    ...extractedData,
                    jobID,
                    addedBy: userID,
                    personal: { ...personal, cvLink },
                };
            }
        }
        const newCandidate = await this.candidateRepo.createCandidate(dataCV);
        return { cvLink, newCandidate, dataCV };
    }
}
exports.UploadCVUseCase = UploadCVUseCase;
//# sourceMappingURL=upload-cv.use-case.js.map