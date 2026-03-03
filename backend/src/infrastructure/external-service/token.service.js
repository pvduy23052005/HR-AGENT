import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
