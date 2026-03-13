"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeStatusUseCase = void 0;
class ChangeStatusUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(id, status) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new Error('Người dùng không tồn tại!');
        const updatedUser = await this.userRepo.updateStatus(id, status);
        return updatedUser.getProfile();
    }
}
exports.ChangeStatusUseCase = ChangeStatusUseCase;
//# sourceMappingURL=change-status.use-case.js.map