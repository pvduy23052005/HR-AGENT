"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordService {
    async hash(plainPassword) {
        return await bcrypt_1.default.hash(plainPassword, 10);
    }
    async compare(plainPassword, hashedPassword) {
        return await bcrypt_1.default.compare(plainPassword, hashedPassword);
    }
}
exports.PasswordService = PasswordService;
//# sourceMappingURL=password.service.js.map