import { Request, Response } from 'express';
import * as userUseCase from '../../../../application/use-case/admin/user';
import * as passwordService from '../../../../infrastructure/external-service/password.service';
import * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';

// [POST] /admin/users/create
export const createUserPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userUseCase.createUser(userRepository, passwordService, req.body as Parameters<typeof userUseCase.createUser>[2]);
    res.json({ code: 200, message: 'Tạo tài khoản HR thành công!', user });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ code: e.statusCode ?? 500, message: e.message ?? 'Lỗi hệ thống khi tạo tài khoản' });
  }
};

// [GET] /admin/user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userUseCase.getUsers(userRepository);
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
    const result = await userUseCase.changeStatus(userRepository, id, status);
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
