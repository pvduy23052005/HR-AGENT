import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/repositories/services/token.service";
import { ITokenPayload } from "../../domain/repositories/services/token.service";


export class TokenService implements ITokenService {
  public async generateToken(payload: ITokenPayload): Promise<string> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" });
  }

  public async verifyToken(token: string): Promise<any> {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    return decoded
  }
}