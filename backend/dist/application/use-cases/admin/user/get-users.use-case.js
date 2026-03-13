"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersUseCase = void 0;
class GetUsersUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute() {
        const users = await this.userRepo.findAll();
        return users.map((user) => user.getProfile());
    }
}
exports.GetUsersUseCase = GetUsersUseCase;
//# sourceMappingURL=get-users.use-case.js.map