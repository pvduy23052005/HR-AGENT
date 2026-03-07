import { UserEntity } from '../domain/entities/client/user.entity';

declare global {
  namespace Express {
    interface Locals {
      user: UserEntity;
    }
  }
}
