import { IAuthService } from '../../interfaces/auth/IAuthService';
import { IUserRepository } from '../../interfaces/user/IUserRepository';
import { ITokenService } from '../../interfaces/auth/ITokenService';
import { CreateUserDTOType } from '../../dtos/auth.dto';
import { ConflictError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async register(data: CreateUserDTOType) {
    // Verificar se o email já está em uso
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'user'
    });

    // Remover a senha do objeto retornado
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }

    // Gerar tokens
    const token = this.tokenService.generateToken({ id: user.id, role: user.role });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.id });

    // Remover a senha do objeto retornado
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar refresh token
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      
      // Buscar usuário
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        return null;
      }

      // Gerar novos tokens
      const newToken = this.tokenService.generateToken({ id: user.id, role: user.role });
      const newRefreshToken = this.tokenService.generateRefreshToken({ id: user.id });

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      return null;
    }
  }

  async logout(userId: number) {
    // Invalidar tokens (pode ser implementado com uma lista de tokens inválidos ou Redis)
    return this.tokenService.invalidateToken(userId);
  }
}
