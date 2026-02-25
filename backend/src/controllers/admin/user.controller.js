import * as userService from "../../services/admin/user.service.js";

// [POST] /admin/users/create
export const createUserPost = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

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
    const users = await userService.getUsers();

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
