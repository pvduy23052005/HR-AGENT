import * as userUseCase from "../../../../application/use-case/admin/user.use-case.js";
import * as passwordService from "../../../../infrastructure/external-service/password.service.js";
import * as userRepository from "../../../../infrastructure/database/repositories/admin/user.repository.js";

// [POST] /admin/users/create
export const createUserPost = async (req, res) => {
  try {
    const user = await userUseCase.createUser(
      userRepository,
      passwordService,
      req.body,
    );

    res.json({
      code: 200,
      message: "Tạo tài khoản HR thành công!",
      user: user,
    });
  } catch (error) {
    console.error("Lỗi tạo User:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      code: statusCode,
      message: error.message || "Lỗi hệ thống khi tạo tài khoản",
    });
  }
};

// [GET] /admin/user
export const getUsers = async (req, res) => {
  try {
    const users = await userUseCase.getUsers(userRepository);

    res.json({
      code: 200,
      message: "Lấy danh sách người dùng thành công!",
      users: users,
    });
  } catch (error) {
    console.error("Lỗi lấy Users:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

// [POST] /admin/user/change-status
export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    console.log(id, status);

    const result = await userUseCase.changeStatus(userRepository, id, status);

    console.log(result);

    res.json({
      code: 200,
      success: true,
      message:
        status === "active" ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản!",
      user: result,
    });
  } catch (error) {
    console.error("Lỗi đổi trạng thái:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      code: statusCode,
      message: error.message || "Lỗi hệ thống",
    });
  }
};
