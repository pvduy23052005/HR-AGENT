"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnalyizeEntity = void 0;
class AiAnalyizeEntity {
    id;
    jobID;
    candidateID;
    summary;
    matchingScore;
    redFlags;
    suggestedQuestions;
    createdAt;
    updatedAt;
    constructor({ id, jobID, candidateID, summary = '', matchingScore = 0, redFlags = [], suggestedQuestions = [], createdAt, updatedAt, }) {
        this.id = id ? id.toString() : '';
        this.jobID = jobID ? jobID.toString() : '';
        this.candidateID = candidateID ? candidateID.toString() : '';
        this.summary = summary ? summary.trim() : '';
        this.matchingScore = matchingScore !== undefined ? Number(matchingScore) : 0;
        this.redFlags = Array.isArray(redFlags) ? redFlags : [];
        this.suggestedQuestions = Array.isArray(suggestedQuestions) ? suggestedQuestions : [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getDetail() {
        return {
            id: this.id,
            jobID: this.jobID,
            candidateID: this.candidateID,
            summary: this.summary,
            matchingScore: this.matchingScore,
            redFlags: this.redFlags,
            suggestedQuestions: this.suggestedQuestions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.AiAnalyizeEntity = AiAnalyizeEntity;
//# sourceMappingURL=aiAnalyize.entity.js.map