"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobEntity = void 0;
class JobEntity {
    id;
    userID;
    title;
    description;
    requirements;
    status;
    createdAt;
    updatedAt;
    constructor({ id, _id, title = '', userID, description = '', requirements = '', status = false, createdAt, updatedAt, }) {
        const entityId = id ?? _id;
        this.id = entityId ? entityId.toString() : '';
        this.userID = userID ? userID.toString() : '';
        this.title = title ? title.trim() : '';
        this.description = description ? description.trim() : '';
        this.requirements = requirements ? requirements.trim() : '';
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    isActive() {
        return this.status === false;
    }
    isOwner(checkUserID) {
        if (!this.userID || !checkUserID)
            return false;
        return this.userID === checkUserID.toString();
    }
    getDetailJob() {
        return {
            id: this.id,
            title: this.title,
            status: this.status,
            description: this.description,
            requirements: this.requirements,
            createdAt: this.createdAt,
        };
    }
    getSummary() {
        return {
            id: this.id,
            title: this.title,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}
exports.JobEntity = JobEntity;
//# sourceMappingURL=job.entity.js.map