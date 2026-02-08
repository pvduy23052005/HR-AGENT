import User from "../../models/user.model.js";

// [POST] /admin/users/create
export const createUserPost = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu!",
      });
    }

    const emailExist = await User.findOne({
      email: email,
      deleted: false,
    });

    if (emailExist) {
      return res.status(400).json({
        code: 400,
        message: "Email này đã tồn tại trong hệ thống!",
      });
    }

    const newUser = new User({
      ...req.body,
      deleted: false,
    });
    await newUser.save();

    res.json({
      code: 200,
      message: "Tạo tài khoản HR thành công!",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Lỗi tạo User:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống khi tạo tài khoản",
      error: error.message,
    });
  }
};
