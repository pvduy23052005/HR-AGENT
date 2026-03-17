"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSourcingLeadsUseCase = void 0;
class GetSourcingLeadsUseCase {
    sourcingLeadRepo;
    constructor(sourcingLeadRepo) {
        this.sourcingLeadRepo = sourcingLeadRepo;
    }
    async execute(filters = {}) {
        return await this.sourcingLeadRepo.findAll(filters);
    }
}
exports.GetSourcingLeadsUseCase = GetSourcingLeadsUseCase;
//# sourceMappingURL=get-sourcing-leads.use-case.js.map