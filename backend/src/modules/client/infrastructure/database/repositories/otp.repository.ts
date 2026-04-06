import OTP from '../models/otp.model';
import { OTPEntity } from '../../../domain/otp/otp.entity';
import type { IOTPReadRepo, IOTPWriteRepo } from '../../../application/ports/repositories/otp.interface';

export class OtpRepository implements IOTPReadRepo, IOTPWriteRepo {
  private mapToEntity(doc: any | null): OTPEntity | null {
    if (!doc) return null;
    return OTPEntity.restore({
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

  public async create(otp: OTPEntity): Promise<OTPEntity | null> {
    const { id, ...data } = otp.getDetail();
    const record = new OTP(data);
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
