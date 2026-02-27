import jwt from "jsonwebtoken";
import Account from "../../models/accountAdmin.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập lại.",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Account.findOne({
      _id: decoded.userID,
      deleted: false,
      status: "active",
    });

    if (!admin) {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        message: "Tài khoản không hợp lệ hoặc đã bị khóa.",
      });
    }

    res.locals.admin = admin;

    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("token");
    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.",
    });
  }
};