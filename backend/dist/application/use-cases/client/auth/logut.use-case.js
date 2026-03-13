"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = void 0;
class LogoutUseCase {
    execute(userID) {
        if (!userID) {
            throw new Error('Không tìm thấy thông tin người dùng!');
        }
    }
}
exports.LogoutUseCase = LogoutUseCase;
//# sourceMappingURL=logut.use-case.js.map