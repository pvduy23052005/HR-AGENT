import type { OTPEntity } from '../../../domain/entities/otp/otp.entity';

export interface IOTPReadRepo {
  findRecentOTP(email: string): Promise<OTPEntity | null>;

  findByEmailAndOTP(email: string, otp: string): Promise<OTPEntity | null>;

  findOTPByEmail(email: string): Promise<OTPEntity | null>;
}

export interface IOTPWriteRepo {
  create(otp: OTPEntity): Promise<OTPEntity | null>;

  deleteOTP(email: string): Promise<{ deletedCount?: number }>;
}