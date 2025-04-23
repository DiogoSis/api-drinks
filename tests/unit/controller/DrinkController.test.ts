import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { DrinkController } from '../../../src/controllers/drink/DrinkController';
import { IDrinkService } from '../../../src/interfaces/drink/IDrinkService';
import { NotFoundError } from '../../../src/errors/AppError';

// Mock do serviço de drinks
const mockDrinkService: jest.Mocked<IDrinkService> = {
  getAllDrinks: jest.fn(),
  getDrinkById: jest.fn(),
  createDrink: jest.fn(),
  updateDrink: jest.fn(),
  deleteDrink: jest.fn(),
  searchDrinksByName: jest.fn(),
  getDrinksByCategory: jest.fn(),
  getDrinkRecipe: jest.fn(),
  checkDrinkStock: jest.fn(),
  calculateDrinkCost: jest.fn(),
  getRelatedDrinks: jest.fn()
};

// Mock de requisição e resposta
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let drinkController: DrinkController;

describe('DrinkController', () => {
  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configuração dos mocks de requisição e resposta
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    
    // Instância do controlador com o serviço mockado
    drinkController = new DrinkController(mockDrinkService);
  });
  
  describe('getDrinks', () => {
    it('deve retornar todos os drinks quando não for fornecido um ID', async () => {
      // Arrange
      const mockDrinks = [
        { id: 1, nome: 'Caipirinha', ingredientes: [] },
        { id: 2, nome: 'Mojito', ingredientes: [] }
      ];
      mockDrinkService.getAllDrinks.mockResolvedValue(mockDrinks);
      
      // Act
      await drinkController.getDrinks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockDrinkService.getAllDrinks).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockDrinks);
    });
    
    it('deve retornar um drink específico quando for fornecido um ID', async () => {
      // Arrange
      const mockDrink = { id: 1, nome: 'Caipirinha', ingredientes: [] };
      mockRequest.params = { id: '1' };
      mockDrinkService.getDrinkById.mockResolvedValue(mockDrink);
      
      // Act
      await drinkController.getDrinks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockDrinkService.getDrinkById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDrink);
    });
    
    it('deve lançar um erro NotFoundError quando o drink não for encontrado', async () => {
      // Arrange
      mockRequest.params = { id: '999' };
      mockDrinkService.getDrinkById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(async () => {
        await drinkController.getDrinks(mockRequest as Request, mockResponse as Response);
      }).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('createDrink', () => {
    it('deve criar um novo drink com sucesso', async () => {
      // Arrange
      const newDrink = {
        nome: 'Margarita',
        descricao: 'Drink mexicano',
        categoria: 'Cocktail',
        ingredientes: [
          { ingredienteId: 1, quantidade: 50 }
        ]
      };
      const createdDrink = { id: 3, ...newDrink };
      
      mockRequest.body = newDrink;
      mockDrinkService.createDrink.mockResolvedValue(createdDrink);
      
      // Act
      await drinkController.createDrink(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockDrinkService.createDrink).toHaveBeenCalledWith(newDrink);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdDrink);
    });
  });
  
  describe('updateDrink', () => {
    it('deve atualizar um drink existente com sucesso', async () => {
      // Arrange
      const drinkId = 1;
      const updateData = {
        nome: 'Caipirinha Atualizada',
        descricao: 'Versão atualizada'
      };
      const updatedDrink = { id: drinkId, nome: 'Caipirinha Atualizada', descricao: 'Versão atualizada', ingredientes: [] };
      
      mockRequest.params = { id: drinkId.toString() };
      mockRequest.body = updateData;
      mockDrinkService.updateDrink.mockResolvedValue(updatedDrink);
      
      // Act
      await drinkController.updateDrink(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockDrinkService.updateDrink).toHaveBeenCalledWith(drinkId, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedDrink);
    });
    
    it('deve lançar um erro NotFoundError quando o drink a ser atualizado não existir', async () => {
      // Arrange
      mockRequest.params = { id: '999' };
      mockRequest.body = { nome: 'Drink Inexistente' };
      mockDrinkService.updateDrink.mockResolvedValue(null);
      
      // Act & Assert
      await expect(async () => {
        await drinkController.updateDrink(mockRequest as Request, mockResponse as Response);
      }).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('deleteDrink', () => {
    it('deve excluir um drink existente com sucesso', async () => {
      // Arrange
      const drinkId = 1;
      mockRequest.params = { id: drinkId.toString() };
      mockDrinkService.deleteDrink.mockResolvedValue(true);
      
      // Act
      await drinkController.deleteDrink(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockDrinkService.deleteDrink).toHaveBeenCalledWith(drinkId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
    
    it('deve lançar um erro NotFoundError quando o drink a ser excluído não existir', async () => {
      // Arrange
      mockRequest.params = { id: '999' };
      mockDrinkService.deleteDrink.mockResolvedValue(false);
      
      // Act & Assert
      await expect(async () => {
        await drinkController.deleteDrink(mockRequest as Request, mockResponse as Response);
      }).rejects.toThrow(NotFoundError);
    });
  });
  
  // Testes adicionais para os outros métodos do controlador
  // searchDrinks, getDrinksByCategory, getDrinkRecipe, checkDrinkStock, calculateDrinkCost, getRelatedDrinks
});
