import { describe, expect, it, jest, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/main';
import { PrismaClient } from '@prisma/client';

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
    $transaction: jest.fn((callback) => callback()),
    $connect: jest.fn(),
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

describe('Drink Routes Integration Tests', () => {
  let prisma: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  describe('GET /v1/drinks', () => {
    it('deve retornar uma lista de drinks', async () => {
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
        },
        {
          drink_id: 2,
          nome: 'Mojito',
          descricao: 'Drink cubano',
          categoria: 'Cocktail',
          preparation: 'Misture tudo',
          photo_url: 'url/foto2.jpg',
          receitadrink: [
            {
              ingrediente: {
                nome: 'Hortelã',
                unidademedida: {
                  abreviacao: 'g'
                }
              },
              quantidade_necessaria: 10
            }
          ]
        }
      ];
      
      prisma.drink.findMany.mockResolvedValue(mockDrinksData);
      
      // Act
      const response = await request(app).get('/v1/drinks');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('Caipirinha');
      expect(response.body[1].nome).toBe('Mojito');
    });
    
    it('deve aplicar filtros quando fornecidos', async () => {
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
      
      prisma.drink.findMany.mockResolvedValue(mockDrinksData);
      
      // Act
      const response = await request(app)
        .get('/v1/drinks')
        .query({ categoria: 'Cocktail' });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe('Caipirinha');
      expect(prisma.drink.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoria: 'Cocktail'
          })
        })
      );
    });
  });
  
  describe('GET /v1/drinks/:id', () => {
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
      
      prisma.drink.findUnique.mockResolvedValue(mockDrinkData);
      
      // Act
      const response = await request(app).get('/v1/drinks/1');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.nome).toBe('Caipirinha');
      expect(response.body.ingredientes).toHaveLength(1);
      expect(response.body.ingredientes[0].nome).toBe('Limão');
    });
    
    it('deve retornar 404 quando o drink não for encontrado', async () => {
      // Arrange
      prisma.drink.findUnique.mockResolvedValue(null);
      
      // Act
      const response = await request(app).get('/v1/drinks/999');
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('não encontrado');
    });
  });
  
  describe('POST /v1/drinks', () => {
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
        photo_url: null,
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
      
      prisma.drink.create.mockResolvedValue({
        drink_id: 3,
        nome: 'Margarita',
        descricao: 'Drink mexicano',
        categoria: 'Cocktail'
      });
      
      prisma.receitadrink.create.mockResolvedValue({});
      prisma.drink.findUnique.mockResolvedValue(mockCreatedDrink);
      
      // Mock do token JWT para autenticação
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE5NzIyMjQwLCJleHAiOjE2MTk4MDg2NDB9.example-token';
      
      // Act
      const response = await request(app)
        .post('/v1/drinks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newDrink);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(3);
      expect(response.body.nome).toBe('Margarita');
      expect(response.body.ingredientes).toHaveLength(1);
      expect(response.body.ingredientes[0].nome).toBe('Tequila');
    });
    
    it('deve retornar 400 quando os dados de entrada forem inválidos', async () => {
      // Arrange
      const invalidDrink = {
        // Nome ausente
        descricao: 'Drink inválido',
        categoria: 'Cocktail',
        ingredientes: [] // Sem ingredientes
      };
      
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE5NzIyMjQwLCJleHAiOjE2MTk4MDg2NDB9.example-token';
      
      // Act
      const response = await request(app)
        .post('/v1/drinks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidDrink);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('validação');
    });
    
    it('deve retornar 401 quando não autenticado', async () => {
      // Arrange
      const newDrink = {
        nome: 'Margarita',
        descricao: 'Drink mexicano',
        categoria: 'Cocktail',
        ingredientes: [
          { ingredienteId: 1, quantidade: 50 }
        ]
      };
      
      // Act - sem token de autenticação
      const response = await request(app)
        .post('/v1/drinks')
        .send(newDrink);
      
      // Assert
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('não fornecido');
    });
  });
  
  // Testes adicionais para outras rotas de drinks
});
