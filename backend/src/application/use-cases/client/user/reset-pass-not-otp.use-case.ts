import { IPasswordService } from "../../../../domain/interfaces/services/password.service";
import { IUserRepository } from "../../../../domain/interfaces/client/user.interface";

export class ResetPassNotOTPUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService
  ) { }

  async execute(email: string, password: string, confirmPasswrod: string): Promise<void> {

    if (password != confirmPasswrod) {
      throw new Error("Mật khẩu không khớp!");
    }

    const existUser = await this.userRepo.findUserByEmail(email);
    if (!existUser) {
      throw new Error("Email không tồn tại!");
    }

    const passwordedHash = await this.passwordService.hash(password);

    await this.userRepo.updateUserPassword(email, passwordedHash)
  }
}