"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
class CreateUserUseCase {
    userRepo;
    passSvc;
    constructor(userRepo, passSvc) {
        this.userRepo = userRepo;
        this.passSvc = passSvc;
    }
    async execute(dataUser) {
        const { fullName, email, password } = dataUser;
        const emailExist = await this.userRepo.findByEmail(email);
        if (emailExist)
            throw new Error('Email này đã tồn tại trong hệ thống!');
        const hashedPassword = await this.passSvc.hash(password);
        const newUser = await this.userRepo.createUser({ fullName, email, password: hashedPassword, status: 'active' });
        return newUser.getProfile();
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=create-user.use-case.js.map