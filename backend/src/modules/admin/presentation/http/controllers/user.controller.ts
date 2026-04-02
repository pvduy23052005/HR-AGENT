import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-users.use-case';
import { ChangeStatusUseCase } from '../../../application/use-cases/user/change-status.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update.use-case';
import { PasswordService } from '../../../../client/infrastructure/external-service/password.service';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import type { ICreateUserInput } from '../../../application/use-cases/user/create-user.use-case';
import type { IUpdateUserInput } from '../../../application/use-cases/user/update.use-case';

const passService = new PasswordService();
const userRepo = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepo, passService);
const getUsersUseCase = new GetUsersUseCase(userRepo);
const changeStatusUseCase = new ChangeStatusUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo, passService);

// [POST] /admin/users/create
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await createUserUseCase.execute(req.body as ICreateUserInput);
    res.json({ code: 200, message: 'Tạo tài khoản HR thành công!', user });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống khi tạo tài khoản' });
  }
};

// [GET] /admin/users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsersUseCase.execute();
    res.json({ code: 200, message: 'Lấy danh sách người dùng thành công!', users });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ code: 500, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [POST] /admin/users/change-status
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, status } = req.body as { id: string; status: string };
    const result = await changeStatusUseCase.execute(id, status);
    res.json({
      code: 200,
      success: true,
      message: status === 'active' ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!',
      user: result,
    });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [PATCH] /admin/users/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as IUpdateUserInput;
    const user = await updateUserUseCase.execute(id, data);
    res.json({ code: 200, message: 'Cập nhật thông tin người dùng thành công!', user });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống khi cập nhật' });
  }
};