import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { DrinkService } from '../../../src/services/drink/DrinkService';
import { IDrinkRepository } from '../../../src/interfaces/drink/IDrinkRepository';
import { IIngredientRepository } from '../../../src/interfaces/ingredient/IIngredientRepository';
import { NotFoundError } from '../../../src/errors/AppError';

// Mock dos repositórios
const mockDrinkRepository: jest.Mocked<IDrinkRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByName: jest.fn(),
  findByCategory: jest.fn(),
  findRecipeByDrinkId: jest.fn(),
  findRelatedDrinks: jest.fn()
};

const mockIngredientRepository: jest.Mocked<IIngredientRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateStock: jest.fn(),
  findLowStock: jest.fn(),
  findByIds: jest.fn(),
  getStockHistory: jest.fn()
};

describe('DrinkService', () => {
  let drinkService: DrinkService;

  beforeEach(() => {
    jest.clearAllMocks();
    drinkService = new DrinkService(mockDrinkRepository, mockIngredientRepository);
  });

  describe('getAllDrinks', () => {
    it('deve retornar todos os drinks', async () => {
      // Arrange
      const mockDrinks = [
        { id: 1, nome: 'Caipirinha', ingredientes: [] },
        { id: 2, nome: 'Mojito', ingredientes: [] }
      ];
      mockDrinkRepository.findAll.mockResolvedValue(mockDrinks);

      // Act
      const result = await drinkService.getAllDrinks();

      // Assert
      expect(mockDrinkRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDrinks);
    });
  });

  describe('getDrinkById', () => {
    it('deve retornar um drink específico quando encontrado', async () => {
      // Arrange
      const mockDrink = { id: 1, nome: 'Caipirinha', ingredientes: [] };
      mockDrinkRepository.findById.mockResolvedValue(mockDrink);

      // Act
      const result = await drinkService.getDrinkById(1);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDrink);
    });

    it('deve retornar null quando o drink não for encontrado', async () => {
      // Arrange
      mockDrinkRepository.findById.mockResolvedValue(null);

      // Act
      const result = await drinkService.getDrinkById(999);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
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
      mockDrinkRepository.create.mockResolvedValue(createdDrink);

      // Act
      const result = await drinkService.createDrink(newDrink);

      // Assert
      expect(mockDrinkRepository.create).toHaveBeenCalledWith(newDrink);
      expect(result).toEqual(createdDrink);
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
      
      mockDrinkRepository.findById.mockResolvedValue({ id: drinkId, nome: 'Caipirinha', ingredientes: [] });
      mockDrinkRepository.update.mockResolvedValue(updatedDrink);

      // Act
      const result = await drinkService.updateDrink(drinkId, updateData);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(drinkId);
      expect(mockDrinkRepository.update).toHaveBeenCalledWith(drinkId, updateData);
      expect(result).toEqual(updatedDrink);
    });

    it('deve retornar null quando o drink a ser atualizado não existir', async () => {
      // Arrange
      const drinkId = 999;
      const updateData = { nome: 'Drink Inexistente' };
      
      mockDrinkRepository.findById.mockResolvedValue(null);

      // Act
      const result = await drinkService.updateDrink(drinkId, updateData);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(drinkId);
      expect(mockDrinkRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteDrink', () => {
    it('deve excluir um drink existente com sucesso', async () => {
      // Arrange
      const drinkId = 1;
      mockDrinkRepository.findById.mockResolvedValue({ id: drinkId, nome: 'Caipirinha', ingredientes: [] });
      mockDrinkRepository.delete.mockResolvedValue(true);

      // Act
      const result = await drinkService.deleteDrink(drinkId);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(drinkId);
      expect(mockDrinkRepository.delete).toHaveBeenCalledWith(drinkId);
      expect(result).toBe(true);
    });

    it('deve retornar false quando o drink a ser excluído não existir', async () => {
      // Arrange
      const drinkId = 999;
      mockDrinkRepository.findById.mockResolvedValue(null);

      // Act
      const result = await drinkService.deleteDrink(drinkId);

      // Assert
      expect(mockDrinkRepository.findById).toHaveBeenCalledWith(drinkId);
      expect(mockDrinkRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('checkDrinkStock', () => {
    it('deve verificar se há estoque suficiente para um drink', async () => {
      // Arrange
      const drinkId = 1;
      const quantidade = 2;
      
      const mockDrink = { 
        id: drinkId, 
        nome: 'Caipirinha', 
        ingredientes: [
          { ingredienteId: 1, quantidade: 50 },
          { ingredienteId: 2, quantidade: 10 }
        ] 
      };
      
      const mockIngredientes = [
        { id: 1, nome: 'Limão', estoqueAtual: 200 },
        { id: 2, nome: 'Açúcar', estoqueAtual: 500 }
      ];
      
      mockDrinkRepository.findRecipeByDrinkId.mockResolvedValue(mockDrink);
      mockIngredientRepository.findByIds.mockResolvedValue(mockIngredientes);
      
      // Act
      const result = await drinkService.checkDrinkStock(drinkId, quantidade);
      
      // Assert
      expect(mockDrinkRepository.findRecipeByDrinkId).toHaveBeenCalledWith(drinkId);
      expect(mockIngredientRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual({
        disponivel: true,
        ingredientes: [
          { id: 1, nome: 'Limão', disponivel: true, quantidadeNecessaria: 100, estoqueAtual: 200 },
          { id: 2, nome: 'Açúcar', disponivel: true, quantidadeNecessaria: 20, estoqueAtual: 500 }
        ]
      });
    });
    
    it('deve identificar falta de estoque para um drink', async () => {
      // Arrange
      const drinkId = 1;
      const quantidade = 10;
      
      const mockDrink = { 
        id: drinkId, 
        nome: 'Caipirinha', 
        ingredientes: [
          { ingredienteId: 1, quantidade: 50 },
          { ingredienteId: 2, quantidade: 10 }
        ] 
      };
      
      const mockIngredientes = [
        { id: 1, nome: 'Limão', estoqueAtual: 200 },
        { id: 2, nome: 'Açúcar', estoqueAtual: 50 }
      ];
      
      mockDrinkRepository.findRecipeByDrinkId.mockResolvedValue(mockDrink);
      mockIngredientRepository.findByIds.mockResolvedValue(mockIngredientes);
      
      // Act
      const result = await drinkService.checkDrinkStock(drinkId, quantidade);
      
      // Assert
      expect(result).toEqual({
        disponivel: false,
        ingredientes: [
          { id: 1, nome: 'Limão', disponivel: true, quantidadeNecessaria: 500, estoqueAtual: 200 },
          { id: 2, nome: 'Açúcar', disponivel: false, quantidadeNecessaria: 100, estoqueAtual: 50 }
        ]
      });
    });
  });
});
