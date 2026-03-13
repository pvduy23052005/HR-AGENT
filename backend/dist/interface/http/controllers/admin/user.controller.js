"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = exports.getUsers = exports.createUser = void 0;
const create_user_use_case_1 = require("../../../../application/use-cases/admin/user/create-user.use-case");
const get_users_use_case_1 = require("../../../../application/use-cases/admin/user/get-users.use-case");
const change_status_use_case_1 = require("../../../../application/use-cases/admin/user/change-status.use-case");
const password_service_1 = require("../../../../infrastructure/external-service/password.service");
const userRepository = __importStar(require("../../../../infrastructure/database/repositories/admin/user.repository"));
const passService = new password_service_1.PasswordService();
const createUserUseCase = new create_user_use_case_1.CreateUserUseCase(userRepository, passService);
const getUsersUseCase = new get_users_use_case_1.GetUsersUseCase(userRepository);
const changeStatusUseCase = new change_status_use_case_1.ChangeStatusUseCase(userRepository);
// [POST] /admin/users/create
const createUser = async (req, res) => {
    try {
        const user = await createUserUseCase.execute(req.body);
        res.json({ code: 200, message: 'Tạo tài khoản HR thành công!', user });
    }
    catch (error) {
        const e = error;
        res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống khi tạo tài khoản' });
    }
};
exports.createUser = createUser;
// [GET] /admin/user
const getUsers = async (req, res) => {
    try {
        const users = await getUsersUseCase.execute();
        res.json({ code: 200, message: 'Lấy danh sách người dùng thành công!', users });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ code: 500, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.getUsers = getUsers;
// [POST] /admin/user/change-status
const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const result = await changeStatusUseCase.execute(id, status);
        res.json({
            code: 200,
            success: true,
            message: status === 'active' ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!',
            user: result,
        });
    }
    catch (error) {
        const e = error;
        res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.changeStatus = changeStatus;
//# sourceMappingURL=user.controller.js.map