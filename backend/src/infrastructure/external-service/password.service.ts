import bcrypt from 'bcrypt';

import { IPasswordService } from '../../domain/interfaces/services/password.service';

export class PasswordService implements IPasswordService {
  public async hash(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10);
  }

  public async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
