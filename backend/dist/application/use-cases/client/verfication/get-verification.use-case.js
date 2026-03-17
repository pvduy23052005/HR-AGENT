"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVerificationUseCase = void 0;
class GetVerificationUseCase {
    candidateRepo;
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(candidateID) {
        return this.candidateRepo.getVerificationByCandidateId(candidateID);
    }
}
exports.GetVerificationUseCase = GetVerificationUseCase;
//# sourceMappingURL=get-verification.use-case.js.map