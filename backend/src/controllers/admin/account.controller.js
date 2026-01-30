import AccountAdmin from "../../models/accountAdmin.model.js";

export const createPost = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập họ tên!",
      });
    }

    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập Email!",
      });
    }

    if (!password) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập mật khẩu!",
      });
    }

    const emailExist = await AccountAdmin.findOne({
      email: email,
      deleted: false,
    });

    if (emailExist) {
      return res.status(400).json({
        code: 400,
        message: `Email ${email} đã tồn tại!`,
      });
    }

    const account = new AccountAdmin(req.body);
    // await record.save();

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công!",
      account: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
      error: error.message,
    });
  }
};
