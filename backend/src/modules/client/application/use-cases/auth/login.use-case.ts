import type { IAuth } from '../../ports/repositories/auth.interface';
import type { IPasswordService } from '../../ports/services/password.service';
import type { ITokenService, ITokenPayload } from '../../ports/services/token.service';
import type { IUserProfile } from '../../../domain/user';

export interface ILoginResult {
  token: string;
  user: IUserProfile;
}

export class LoginUseCase {
  constructor(
    private readonly authRepo: IAuth,
    private readonly passService: IPasswordService,
    private readonly tokService: ITokenService,
  ) { }

  async execute(email: string, password: string): Promise<ILoginResult> {
    const user = await this.authRepo.findUserByEmail(email);

    if (!user) throw new Error('Email không tồn tại!');

    if (!user.isActive()) throw new Error('Tài khoản đã bị khóa! Vui lòng liên hệ Admin.');

    const passwordMatch = await user.verifyPassword(password, this.passService);
    if (!passwordMatch) throw new Error('Mật khẩu không chính xác!');

    const payload: ITokenPayload = {
      userID: user.getId() ?? '',
    };

    const token = await this.tokService.generateToken(payload);

    return { token, user: user.getProfile() };
  }
}
