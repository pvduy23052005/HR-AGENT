"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEntity = void 0;
class VerificationEntity {
    id;
    candidateId;
    isVerified;
    name;
    age;
    phone;
    email;
    githubStars;
    topLanguages;
    probedProjects;
    aiReasoning;
    createdAt;
    updatedAt;
    constructor(data) {
        this.id = data.id;
        this.candidateId = data.candidateId;
        this.isVerified = data.isVerified ?? false;
        this.name = data.name;
        this.email = data.email;
        this.age = data.age;
        this.phone = data.phone;
        this.githubStars = data.githubStars ?? 0;
        this.topLanguages = data.topLanguages || [];
        this.probedProjects = data.probedProjects;
        this.aiReasoning = data.aiReasoning;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    isTopCandidate() {
        return this.githubStars > 100 && this.topLanguages.length >= 3;
    }
}
exports.VerificationEntity = VerificationEntity;
//# sourceMappingURL=verifycation.entity.js.map