"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusUseCase = void 0;
class UpdateStatusUseCase {
    candidateRepo;
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(candidateID, status) {
        const candidate = await this.candidateRepo.getCandidateById(candidateID);
        if (!candidate) {
            throw new Error("Ứng viên không tồn tại");
        }
        await this.candidateRepo.updateStatus(candidateID, status);
    }
}
exports.UpdateStatusUseCase = UpdateStatusUseCase;
//# sourceMappingURL=update-status.use-case.js.map