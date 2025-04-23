import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth/AuthController';
import { IAuthService } from '../../../src/interfaces/auth/IAuthService';
import { Request, Response } from 'express';
import { UnauthorizedError } from '../../../src/errors/AppError';

// Mock do serviço de autenticação
const mockAuthService: jest.Mocked<IAuthService> = {
  register: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn()
};

// Mock de requisição e resposta
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let authController: AuthController;

describe('AuthController', () => {
  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configuração dos mocks de requisição e resposta
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: { id: 1, role: 'user' }
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    
    // Instância do controlador com o serviço mockado
    authController = new AuthController(mockAuthService);
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
      
      mockRequest.body = userData;
      mockAuthService.register.mockResolvedValue(createdUser);
      
      // Act
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
    });
  });
  
  describe('login', () => {
    it('deve autenticar um usuário com sucesso', async () => {
      // Arrange
      const loginData = {
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      const authResult = {
        user: {
          id: 1,
          name: 'Teste',
          email: 'teste@example.com',
          role: 'user'
        },
        token: 'jwt-token',
        refreshToken: 'refresh-token'
      };
      
      mockRequest.body = loginData;
      mockAuthService.login.mockResolvedValue(authResult);
      
      // Act
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockResponse.json).toHaveBeenCalledWith(authResult);
    });
    
    it('deve lançar um erro quando as credenciais forem inválidas', async () => {
      // Arrange
      const loginData = {
        email: 'teste@example.com',
        password: 'senha-errada'
      };
      
      mockRequest.body = loginData;
      mockAuthService.login.mockResolvedValue(null);
      
      // Act & Assert
      await expect(async () => {
        await authController.login(mockRequest as Request, mockResponse as Response);
      }).rejects.toThrow(UnauthorizedError);
    });
  });
  
  describe('refreshToken', () => {
    it('deve renovar o token com sucesso', async () => {
      // Arrange
      const refreshData = {
        refreshToken: 'refresh-token'
      };
      
      const refreshResult = {
        token: 'novo-jwt-token',
        refreshToken: 'novo-refresh-token'
      };
      
      mockRequest.body = refreshData;
      mockAuthService.refreshToken.mockResolvedValue(refreshResult);
      
      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshData.refreshToken);
      expect(mockResponse.json).toHaveBeenCalledWith(refreshResult);
    });
    
    it('deve lançar um erro quando o refresh token for inválido', async () => {
      // Arrange
      const refreshData = {
        refreshToken: 'token-invalido'
      };
      
      mockRequest.body = refreshData;
      mockAuthService.refreshToken.mockResolvedValue(null);
      
      // Act & Assert
      await expect(async () => {
        await authController.refreshToken(mockRequest as Request, mockResponse as Response);
      }).rejects.toThrow(UnauthorizedError);
    });
  });
  
  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Arrange
      mockAuthService.logout.mockResolvedValue(true);
      
      // Act
      await authController.logout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });
});
