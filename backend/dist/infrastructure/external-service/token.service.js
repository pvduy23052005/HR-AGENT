"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    async generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    }
    async verifyToken(token) {
        const decoded = await jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map