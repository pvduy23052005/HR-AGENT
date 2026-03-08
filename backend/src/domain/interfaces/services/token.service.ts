
export interface ITokenPayload {
  userID: string
}

export interface ITokenService {
  generateToken(payload: ITokenPayload): Promise<string>;
  verifyToken(token: string): Promise<string>;
}