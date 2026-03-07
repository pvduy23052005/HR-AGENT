import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ITokenPayload {
  userID: string;
}

export const generateToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '5d',
  });
};

export const verifyToken = (token: string): ITokenPayload & JwtPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as ITokenPayload & JwtPayload;
};
