"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_entity_1 = require("../../../../domain/entities/client/user.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    const d = doc;
    return new user_entity_1.UserEntity({
        id: d._id.toString(),
        fullName: d.fullName,
        email: d.email,
        password: d.password,
        avatar: d.avatar,
        status: d.status,
        deleted: d.deleted,
        deletedAt: d.deletedAt,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
    });
};
class AuthRepository {
    async findUserByEmail(email) {
        const user = await user_model_1.default.findOne({ email, deleted: false }).lean();
        return mapToEntity(user);
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map