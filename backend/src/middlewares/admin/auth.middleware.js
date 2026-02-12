import jwt from "jsonwebtoken";
import AccountAdmin from "../../models/accountAdmin.model.js";

export const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookie?.token;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1] || "";
    }

    console.log(token);

    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "vui lòng đăng nhập lại",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = AccountAdmin.findOne({
      _id: decoded.userID,
      deleted: false,
      status: "active",
    });

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
