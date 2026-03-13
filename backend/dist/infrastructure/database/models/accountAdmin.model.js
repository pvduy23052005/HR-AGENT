"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role_id: { type: String, default: 'admin' },
    status: { type: String, default: 'active' },
    avatar: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
const Account = mongoose_1.default.model('AccountAdmin', accountSchema, 'accountAdmins');
exports.default = Account;
//# sourceMappingURL=accountAdmin.model.js.map