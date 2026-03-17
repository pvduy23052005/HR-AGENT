"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCandidateDetailUseCase = void 0;
class GetCandidateDetailUseCase {
    candidateRepo;
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(candidateID) {
        return await this.candidateRepo.getCandidateById(candidateID);
    }
}
exports.GetCandidateDetailUseCase = GetCandidateDetailUseCase;
//# sourceMappingURL=get-candidate-detail.use-case.js.map