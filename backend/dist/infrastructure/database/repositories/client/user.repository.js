"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_entity_1 = require("../../../../domain/entities/client/user.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    return new user_entity_1.UserEntity({
        id: doc._id.toString(),
        fullName: doc.fullName,
        email: doc.email,
        password: doc.password,
        avatar: doc.avatar,
        status: doc.status,
        deleted: doc.deleted,
        deletedAt: doc.deletedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};
class UserRepository {
    async findUserByEmail(email) {
        const doc = await user_model_1.default.findOne({ email, deleted: false }).lean();
        return mapToEntity(doc);
    }
    async findUserByID(userID) {
        const doc = await user_model_1.default.findOne({ _id: userID, deleted: false, status: 'active' }).lean();
        return mapToEntity(doc);
    }
    async updateUserPassword(email, password) {
        const updatedDoc = await user_model_1.default.findOneAndUpdate({ email }, { password }, { new: true }).lean();
        return mapToEntity(updatedDoc);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map