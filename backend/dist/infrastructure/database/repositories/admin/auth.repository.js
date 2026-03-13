"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const accountAdmin_model_1 = __importDefault(require("../../models/accountAdmin.model"));
const accountAdmin_entity_1 = require("../../../../domain/entities/admin/accountAdmin.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    return new accountAdmin_entity_1.AdminEntity({
        id: doc._id.toString(),
        fullName: doc.fullName,
        email: doc.email,
        password: doc.password,
        role: doc.role_id ?? '',
        status: doc.status,
        deleted: doc.deleted,
    });
};
class AuthRepository {
    async findAccountByEmail(email) {
        const adminDoc = await accountAdmin_model_1.default.findOne({ email, deleted: false }).lean();
        return mapToEntity(adminDoc);
    }
    async findAccountByID(id) {
        const adminDoc = await accountAdmin_model_1.default.findOne({ _id: id, deleted: false }).lean();
        return mapToEntity(adminDoc);
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map