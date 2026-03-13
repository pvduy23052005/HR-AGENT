"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPEntity = void 0;
class OTPEntity {
    id;
    email;
    otp;
    expireAt;
    createdAt;
    updatedAt;
    constructor({ id, email, otp, expireAt, createdAt, updatedAt }) {
        this.id = id;
        this.email = email;
        this.otp = otp;
        this.expireAt = expireAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    isExpired() {
        const now = new Date();
        return now > new Date(this.expireAt);
    }
}
exports.OTPEntity = OTPEntity;
//# sourceMappingURL=otp.entity.js.map