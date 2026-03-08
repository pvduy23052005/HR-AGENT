import type { OTPEntity } from '../../entities/client/otp.entity';

export interface IOtpRepository {
  findRecentOTP(email: string): Promise<OTPEntity | null>;

  createOTP(email: string, otp: string): Promise<OTPEntity | null>;

  findByEmailAndOTP(email: string, otp: string): Promise<OTPEntity | null>;

  findOTPByEmail(email: string): Promise<OTPEntity | null>;
  
  deleteOTP(email: string): Promise<{ deletedCount?: number }>;
}
