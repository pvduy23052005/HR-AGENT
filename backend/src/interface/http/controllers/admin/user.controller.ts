import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../../application/use-cases/admin/user/create-user.use-case';
import { GetUsersUseCase } from '../../../../application/use-cases/admin/user/get-users.use-case';
import { ChangeStatusUseCase } from '../../../../application/use-cases/admin/user/change-status.use-case';
import { UpdateUserUseCase } from '../../../../application/use-cases/admin/user/update-user.use-case';
import { PasswordService } from '../../../../infrastructure/external-service/password.service';
import * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { ICreateUserInput } from '../../../../application/use-cases/admin/user/create-user.use-case';
import type { IUpdateUserInput } from '../../../../application/use-cases/admin/user/update-user.use-case';

const passService = new PasswordService();
const createUserUseCase = new CreateUserUseCase(userRepository, passService);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const changeStatusUseCase = new ChangeStatusUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, passService);

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

// [GET] /admin/user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsersUseCase.execute();
    res.json({ code: 200, message: 'Lấy danh sách người dùng thành công!', users });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ code: 500, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [POST] /admin/user/change-status
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

// [PUT] /admin/users/:id
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as IUpdateUserInput;
    updateData.id = id;
    const user = await updateUserUseCase.execute(updateData);
    res.json({ code: 200, message: 'Cập nhật tài khoản thành công!', user });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi cập nhật tài khoản' });
  }
};
