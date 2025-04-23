import { ITokenService } from '../../interfaces/auth/ITokenService';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

interface TokenPayload {
  id: number;
  role?: string;
}

export class TokenService implements ITokenService {
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.auth.jwt.secret, {
      expiresIn: config.auth.jwt.expiresIn
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.auth.jwt.secret, {
      expiresIn: config.auth.jwt.refreshExpiresIn
    });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, config.auth.jwt.secret);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, config.auth.jwt.secret);
  }

  async invalidateToken(userId: number): Promise<boolean> {
    // Em uma implementação real, você poderia adicionar o token a uma lista negra
    // ou usar Redis para armazenar tokens inválidos
    // Por simplicidade, apenas retornamos true aqui
    return true;
  }
}
