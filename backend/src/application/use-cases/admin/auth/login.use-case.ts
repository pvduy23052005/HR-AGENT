import type { ITokenPayload, ITokenService } from '../../../../domain/interfaces/services/token.service';
import type { IAccountAdmin } from '../../../../domain/interfaces/admin/accountAdmin.interface';
import type { IAdminProfile } from '../../../../domain/entities/admin/accountAdmin.entity';

export interface IAdminLoginResult {
  token: string;
  admin: IAdminProfile;
}

export class LoginUseCase {
  
  constructor(
    private readonly authRepo: IAccountAdmin,
    private readonly tokService: ITokenService
  ) { }

  async execute(email: string, password: string): Promise<IAdminLoginResult> {
    const admin = await this.authRepo.findAccountByEmail(email);

    if (!admin) throw new Error('Email không tồn tại!');

    if (!admin.isActive()) throw new Error('Tài khoản Admin đã bị khóa!');

    if (!admin.verifyPassword(password)) throw new Error('Mật khẩu không chính xác!');

    const payload: ITokenPayload = {
      userID: admin.getID()
    }

    const token: string = await this.tokService.generateToken(payload);

    return { token, admin: admin.getProfile() };
  }
}
