import { CreateUserDTOType } from '../../dtos/auth.dto';

export interface IAuthService {
  register(data: CreateUserDTOType): Promise<any>;
  login(email: string, password: string): Promise<any | null>;
  refreshToken(refreshToken: string): Promise<any | null>;
  logout(userId: number): Promise<boolean>;
}
