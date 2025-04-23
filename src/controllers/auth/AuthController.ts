import { Request, Response } from 'express';
import { IAuthService } from '../../interfaces/auth/IAuthService';
import { UnauthorizedError } from '../../errors/AppError';
import { CreateUserDTOType, LoginDTOType, RefreshTokenDTOType } from '../../dtos/auth.dto';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    const userData: CreateUserDTOType = req.body;
    const user = await this.authService.register(userData);
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password }: LoginDTOType = req.body;
    const authResult = await this.authService.login(email, password);
    
    if (!authResult) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    
    return res.json(authResult);
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken }: RefreshTokenDTOType = req.body;
    const tokens = await this.authService.refreshToken(refreshToken);
    
    if (!tokens) {
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }
    
    return res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }
    
    await this.authService.logout(userId);
    return res.status(204).send();
  }
}
