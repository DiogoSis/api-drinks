export interface ITokenService {
  generateToken(payload: any): string;
  generateRefreshToken(payload: any): string;
  verifyToken(token: string): any;
  verifyRefreshToken(token: string): any;
  invalidateToken(userId: number): Promise<boolean>;
}
