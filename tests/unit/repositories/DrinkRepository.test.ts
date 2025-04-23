import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { DrinkRepository } from '../../../src/repositories/drink/DrinkRepository';

// Mock do Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    drink: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    receitadrink: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn((callback) => callback())
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

describe('DrinkRepository', () => {
  let drinkRepository: DrinkRepository;
  let prismaClient: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prismaClient = new PrismaClient();
    drinkRepository = new DrinkRepository(prismaClient);
  });
  
  describe('findAll', () => {
    it('deve retornar todos os drinks', async () => {
      // Arrange
      const mockDrinksData = [
        {
          drink_id: 1,
          nome: 'Caipirinha',
          descricao: 'Drink brasileiro',
          categoria: 'Cocktail',
          preparation: 'Misture tudo',
          photo_url: 'url/foto.jpg',
          receitadrink: [
            {
              ingrediente: {
                nome: 'Limão',
                unidademedida: {
                  abreviacao: 'ml'
                }
              },
              quantidade_necessaria: 50
            }
          ]
        }
      ];
      
      prismaClient.drink.findMany.mockResolvedValue(mockDrinksData);
      
      // Act
      const result = await drinkRepository.findAll();
      
      // Assert
      expect(prismaClient.drink.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        nome: 'Caipirinha',
        descricao: 'Drink brasileiro',
        categoria: 'Cocktail',
        preparation: 'Misture tudo',
        photoUrl: 'url/foto.jpg',
        ingredientes: [
          {
            nome: 'Limão',
            quantidade: 50,
            unidadeMedida: 'ml'
          }
        ]
      });
    });
  });
  
  describe('findById', () => {
    it('deve retornar um drink específico quando encontrado', async () => {
      // Arrange
      const mockDrinkData = {
        drink_id: 1,
        nome: 'Caipirinha',
        descricao: 'Drink brasileiro',
        categoria: 'Cocktail',
        preparation: 'Misture tudo',
        photo_url: 'url/foto.jpg',
        receitadrink: [
          {
            ingrediente: {
              nome: 'Limão',
              unidademedida: {
                abreviacao: 'ml'
              }
            },
            quantidade_necessaria: 50
          }
        ]
      };
      
      prismaClient.drink.findUnique.mockResolvedValue(mockDrinkData);
      
      // Act
      const result = await drinkRepository.findById(1);
      
      // Assert
      expect(prismaClient.drink.findUnique).toHaveBeenCalledWith({
        where: { drink_id: 1 },
        include: {
          receitadrink: {
            include: {
              ingrediente: {
                include: {
                  unidademedida: true
                }
              }
            }
          }
        }
      });
      
      expect(result).toEqual({
        id: 1,
        nome: 'Caipirinha',
        descricao: 'Drink brasileiro',
        categoria: 'Cocktail',
        preparation: 'Misture tudo',
        photoUrl: 'url/foto.jpg',
        ingredientes: [
          {
            nome: 'Limão',
            quantidade: 50,
            unidadeMedida: 'ml'
          }
        ]
      });
    });
    
    it('deve retornar null quando o drink não for encontrado', async () => {
      // Arrange
      prismaClient.drink.findUnique.mockResolvedValue(null);
      
      // Act
      const result = await drinkRepository.findById(999);
      
      // Assert
      expect(prismaClient.drink.findUnique).toHaveBeenCalledWith({
        where: { drink_id: 999 },
        include: {
          receitadrink: {
            include: {
              ingrediente: {
                include: {
                  unidademedida: true
                }
              }
            }
          }
        }
      });
      
      expect(result).toBeNull();
    });
  });
  
  describe('create', () => {
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
      
      const mockCreatedDrink = {
        drink_id: 3,
        nome: 'Margarita',
        descricao: 'Drink mexicano',
        categoria: 'Cocktail',
        preparation: null,
        photo_url: null
      };
      
      prismaClient.drink.create.mockResolvedValue(mockCreatedDrink);
      prismaClient.receitadrink.create.mockResolvedValue({});
      
      // Mock para o findById que será chamado após a criação
      const mockDrinkWithIngredients = {
        ...mockCreatedDrink,
        receitadrink: [
          {
            ingrediente: {
              nome: 'Tequila',
              unidademedida: {
                abreviacao: 'ml'
              }
            },
            quantidade_necessaria: 50
          }
        ]
      };
      
      prismaClient.drink.findUnique.mockResolvedValue(mockDrinkWithIngredients);
      
      // Act
      const result = await drinkRepository.create(newDrink);
      
      // Assert
      expect(prismaClient.drink.create).toHaveBeenCalledWith({
        data: {
          nome: 'Margarita',
          descricao: 'Drink mexicano',
          categoria: 'Cocktail'
        }
      });
      
      expect(prismaClient.receitadrink.create).toHaveBeenCalledWith({
        data: {
          drink_id: 3,
          ingrediente_id: 1,
          quantidade_necessaria: 50
        }
      });
      
      expect(result).toEqual({
        id: 3,
        nome: 'Margarita',
        descricao: 'Drink mexicano',
        categoria: 'Cocktail',
        ingredientes: [
          {
            nome: 'Tequila',
            quantidade: 50,
            unidadeMedida: 'ml'
          }
        ]
      });
    });
  });
  
  describe('update', () => {
    it('deve atualizar um drink existente com sucesso', async () => {
      // Arrange
      const drinkId = 1;
      const updateData = {
        nome: 'Caipirinha Atualizada',
        descricao: 'Versão atualizada'
      };
      
      const mockUpdatedDrink = {
        drink_id: drinkId,
        nome: 'Caipirinha Atualizada',
        descricao: 'Versão atualizada',
        categoria: 'Cocktail',
        preparation: 'Misture tudo',
        photo_url: 'url/foto.jpg'
      };
      
      prismaClient.drink.update.mockResolvedValue(mockUpdatedDrink);
      
      // Mock para o findById que será chamado após a atualização
      const mockDrinkWithIngredients = {
        ...mockUpdatedDrink,
        receitadrink: [
          {
            ingrediente: {
              nome: 'Limão',
              unidademedida: {
                abreviacao: 'ml'
              }
            },
            quantidade_necessaria: 50
          }
        ]
      };
      
      prismaClient.drink.findUnique.mockResolvedValue(mockDrinkWithIngredients);
      
      // Act
      const result = await drinkRepository.update(drinkId, updateData);
      
      // Assert
      expect(prismaClient.drink.update).toHaveBeenCalledWith({
        where: { drink_id: drinkId },
        data: updateData
      });
      
      expect(result).toEqual({
        id: 1,
        nome: 'Caipirinha Atualizada',
        descricao: 'Versão atualizada',
        categoria: 'Cocktail',
        preparation: 'Misture tudo',
        photoUrl: 'url/foto.jpg',
        ingredientes: [
          {
            nome: 'Limão',
            quantidade: 50,
            unidadeMedida: 'ml'
          }
        ]
      });
    });
  });
  
  describe('delete', () => {
    it('deve excluir um drink existente com sucesso', async () => {
      // Arrange
      const drinkId = 1;
      
      prismaClient.receitadrink.delete.mockResolvedValue({});
      prismaClient.drink.delete.mockResolvedValue({});
      
      // Act
      const result = await drinkRepository.delete(drinkId);
      
      // Assert
      expect(prismaClient.$transaction).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
