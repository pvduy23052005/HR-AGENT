"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createUser = exports.findAll = exports.findById = exports.findByEmail = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_entity_1 = require("../../../../domain/entities/admin/user.entity");
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
const findByEmail = async (email) => {
    const doc = await user_model_1.default.findOne({ email, deleted: false }).lean();
    return mapToEntity(doc);
};
exports.findByEmail = findByEmail;
const findById = async (id) => {
    const doc = await user_model_1.default.findOne({ _id: id, deleted: false }).lean();
    return mapToEntity(doc);
};
exports.findById = findById;
const findAll = async () => {
    const docs = await user_model_1.default.find({ deleted: false }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => mapToEntity(doc));
};
exports.findAll = findAll;
const createUser = async (data) => {
    const newUser = new user_model_1.default(data);
    const savedDoc = await newUser.save();
    return mapToEntity(savedDoc);
};
exports.createUser = createUser;
const updateStatus = async (id, status) => {
    const updatedDoc = await user_model_1.default.findOneAndUpdate({ _id: id }, { status }, { new: true });
    return mapToEntity(updatedDoc);
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=user.repository.js.map