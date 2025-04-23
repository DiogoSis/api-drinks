import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth/AuthService';
import { IUserRepository } from '../../../src/interfaces/user/IUserRepository';
import { ITokenService } from '../../../src/interfaces/auth/ITokenService';
import { UnauthorizedError } from '../../../src/errors/AppError';
import bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn()
}));

// Mock dos repositórios e serviços
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generateToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  invalidateToken: jest.fn()
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockUserRepository, mockTokenService);
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Arrange
      const userData = {
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      const createdUser = {
        id: 1,
        name: 'Teste',
        email: 'teste@example.com',
        role: 'user'
      };
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);
      
      // Act
      const result = await authService.register(userData);
      
      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, expect.any(Number));
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: 'hashed-password',
        role: 'user'
      });
      expect(result).toEqual(createdUser);
    });
    
    it('deve lançar um erro quando o email já estiver em uso', async () => {
      // Arrange
      const userData = {
        name: 'Teste',
        email: 'existente@example.com',
        password: 'senha123'
      };
      
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 2,
        name: 'Usuário Existente',
        email: 'existente@example.com',
        role: 'user'
      });
      
      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow('Email já está em uso');
    });
  });
  
  describe('login', () => {
    it('deve autenticar um usuário com credenciais válidas', async () => {
      // Arrange
      const email = 'teste@example.com';
      const password = 'senha123';
      
      const user = {
        id: 1,
        name: 'Teste',
        email,
        password: 'hashed-password',
        role: 'user'
      };
      
      mockUserRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockTokenService.generateToken.mockReturnValue('jwt-token');
      mockTokenService.generateRefreshToken.mockReturnValue('refresh-token');
      
      // Act
      const result = await authService.login(email, password);
      
      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith({ id: user.id, role: user.role });
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: 'jwt-token',
        refreshToken: 'refresh-token'
      });
    });
    
    it('deve retornar null quando o usuário não for encontrado', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      // Act
      const result = await authService.login('inexistente@example.com', 'senha123');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('deve retornar null quando a senha for inválida', async () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Teste',
        email: 'teste@example.com',
        password: 'hashed-password',
        role: 'user'
      };
      
      mockUserRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      // Act
      const result = await authService.login('teste@example.com', 'senha-errada');
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('refreshToken', () => {
    it('deve renovar o token com sucesso', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const payload = { id: 1 };
      
      mockTokenService.verifyRefreshToken.mockReturnValue(payload);
      mockUserRepository.findById.mockResolvedValue({
        id: 1,
        name: 'Teste',
        email: 'teste@example.com',
        role: 'user'
      });
      mockTokenService.generateToken.mockReturnValue('novo-jwt-token');
      mockTokenService.generateRefreshToken.mockReturnValue('novo-refresh-token');
      
      // Act
      const result = await authService.refreshToken(refreshToken);
      
      // Assert
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith({ id: 1, role: 'user' });
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        token: 'novo-jwt-token',
        refreshToken: 'novo-refresh-token'
      });
    });
    
    it('deve retornar null quando o refresh token for inválido', async () => {
      // Arrange
      mockTokenService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Token inválido');
      });
      
      // Act
      const result = await authService.refreshToken('invalid-token');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('deve retornar null quando o usuário não for encontrado', async () => {
      // Arrange
      mockTokenService.verifyRefreshToken.mockReturnValue({ id: 999 });
      mockUserRepository.findById.mockResolvedValue(null);
      
      // Act
      const result = await authService.refreshToken('valid-token-unknown-user');
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Arrange
      const userId = 1;
      mockTokenService.invalidateToken.mockResolvedValue(true);
      
      // Act
      const result = await authService.logout(userId);
      
      // Assert
      expect(mockTokenService.invalidateToken).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });
  });
});
