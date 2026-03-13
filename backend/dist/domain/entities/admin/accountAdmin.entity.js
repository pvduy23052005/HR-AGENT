"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEntity = void 0;
class AdminEntity {
    id;
    fullName;
    email;
    password;
    role;
    status;
    deleted;
    constructor({ id, fullName, email, password, role = 'admin', status, deleted, }) {
        this.id = id?.toString() || "";
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.deleted = deleted;
    }
    isActive() {
        return this.status === 'active';
    }
    verifyPassword(password) {
        return this.password === password;
    }
    getProfile() {
        return {
            id: this.id ?? '',
            fullName: this.fullName,
            email: this.email,
            role: this.role,
            status: this.status,
        };
    }
    getID() {
        return this.id;
    }
}
exports.AdminEntity = AdminEntity;
//# sourceMappingURL=accountAdmin.entity.js.map