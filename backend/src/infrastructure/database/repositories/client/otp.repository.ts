import OTP from '../../models/otp.model';
import { OTPEntity } from '../../../../domain/entities/client/otp';
import type { IOTPReadRepo, IOTPWriteRepo } from '../../../../domain/repositories/client/otp.interface';

export class OtpRepository implements IOTPReadRepo, IOTPWriteRepo {
  private mapToEntity(doc: any | null): OTPEntity | null {
    if (!doc) return null;
    return new OTPEntity({
      id: doc._id.toString(),
      email: doc.email,
      otp: doc.otp,
      expireAt: doc.expireAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public async findRecentOTP(email: string): Promise<OTPEntity | null> {
    const doc = await OTP.findOne({ email }).sort({ createdAt: -1 }).lean();
    return this.mapToEntity(doc);
  }

  public async createOTP(email: string, otp: string): Promise<OTPEntity | null> {
    const record = new OTP({ email, otp });
    const savedDoc = await record.save();
    return this.mapToEntity(savedDoc);
  }

  public async findByEmailAndOTP(email: string, otp: string): Promise<OTPEntity | null> {
    const doc = await OTP.findOne({ email, otp }).lean();
    return this.mapToEntity(doc);
  }

  public async findOTPByEmail(email: string): Promise<OTPEntity | null> {
    const doc = await OTP.findOne({ email }).lean();
    return this.mapToEntity(doc);
  }

  public async deleteOTP(email: string): Promise<{ deletedCount?: number }> {
    return await OTP.deleteOne({ email });
  }
}
