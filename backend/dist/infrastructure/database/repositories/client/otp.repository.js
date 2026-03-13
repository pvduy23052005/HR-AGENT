"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const otp_entity_1 = require("../../../../domain/entities/client/otp.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    return new otp_entity_1.OTPEntity({
        id: doc._id.toString(),
        email: doc.email,
        otp: doc.otp,
        expireAt: doc.expireAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};
class OtpRepository {
    async findRecentOTP(email) {
        const doc = await otp_model_1.default.findOne({ email }).sort({ createdAt: -1 }).lean();
        return mapToEntity(doc);
    }
    async createOTP(email, otp) {
        const record = new otp_model_1.default({ email, otp });
        const savedDoc = await record.save();
        return mapToEntity(savedDoc);
    }
    async findByEmailAndOTP(email, otp) {
        const doc = await otp_model_1.default.findOne({ email, otp }).lean();
        return mapToEntity(doc);
    }
    async findOTPByEmail(email) {
        const doc = await otp_model_1.default.findOne({ email }).lean();
        return mapToEntity(doc);
    }
    async deleteOTP(email) {
        return await otp_model_1.default.deleteOne({ email });
    }
}
exports.OtpRepository = OtpRepository;
//# sourceMappingURL=otp.repository.js.map