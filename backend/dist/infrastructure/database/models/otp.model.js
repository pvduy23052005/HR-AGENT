"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 60 } },
}, { timestamps: true });
const OTP = mongoose_1.default.model('OTP', otpSchema, 'otp');
exports.default = OTP;
//# sourceMappingURL=otp.model.js.map