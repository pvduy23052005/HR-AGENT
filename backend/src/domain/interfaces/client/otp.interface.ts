import type { OTPEntity } from '../../entities/client/otp';

export interface IOTPReadRepo {
  findRecentOTP(email: string): Promise<OTPEntity | null>;

  findByEmailAndOTP(email: string, otp: string): Promise<OTPEntity | null>;

  findOTPByEmail(email: string): Promise<OTPEntity | null>;
}

export interface IOTPWriteRepo {
  createOTP(email: string, otp: string): Promise<OTPEntity | null>;

  deleteOTP(email: string): Promise<{ deletedCount?: number }>;
}