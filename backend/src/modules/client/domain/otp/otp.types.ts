export interface IOTPProps {
  id?: string ;
  email: string;
  otp: string;
  expireAt: Date | string;
  createdAt?: Date ;
  updatedAt?: Date ;
}
