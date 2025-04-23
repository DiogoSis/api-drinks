import { PrismaClient } from '@prisma/client';
import { IDrinkRepository } from '../../interfaces/drink';
import { CreateDrinkDTOType, SearchDrinkDTOType, UpdateDrinkDTOType } from '../../dtos/drink.dto';
import { IDrink } from '../../interfaces/drink';

export class DrinkRepository implements IDrinkRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: SearchDrinkDTOType): Promise<IDrink[]> {
    const where: any = {};
    
    if (filters?.nome) {
      where.nome = {
        contains: filters.nome,
        mode: 'insensitive'
      };
    }
    
    if (filters?.categoria) {
      where.categoria = filters.categoria;
    }
    
    const drinks = await this.prisma.drink.findMany({
      where,
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
      },
      skip: filters?.page ? (filters.page - 1) * (filters.limit || 10) : undefined,
      take: filters?.limit || undefined
    });
    
    return drinks.map(drink => this.mapDrinkToDTO(drink));
  }

  async findById(id: number): Promise<IDrink | null> {
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id },
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
    
    if (!drink) {
      return null;
    }
    
    return this.mapDrinkToDTO(drink);
  }

  async create(data: CreateDrinkDTOType): Promise<IDrink> {
    const { ingredientes, ...drinkData } = data;
    
    // Criar o drink
    const drink = await this.prisma.drink.create({
      data: {
        nome: drinkData.nome,
        descricao: drinkData.descricao,
        categoria: drinkData.categoria,
        preparation: drinkData.preparation,
        photo_url: drinkData.photoUrl
      }
    });
    
    // Adicionar ingredientes à receita
    for (const ingrediente of ingredientes) {
      await this.prisma.receitadrink.create({
        data: {
          drink_id: drink.drink_id,
          ingrediente_id: ingrediente.ingredienteId,
          quantidade_necessaria: ingrediente.quantidade
        }
      });
    }
    
    // Buscar o drink completo com ingredientes
    return this.findById(drink.drink_id) as Promise<IDrink>;
  }

  async update(id: number, data: UpdateDrinkDTOType): Promise<IDrink | null> {
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id }
    });
    
    if (!drink) {
      return null;
    }
    
    const { ingredientes, ...drinkData } = data;
    
    // Atualizar o drink
    await this.prisma.drink.update({
      where: { drink_id: id },
      data: {
        nome: drinkData.nome,
        descricao: drinkData.descricao,
        categoria: drinkData.categoria,
        preparation: drinkData.preparation,
        photo_url: drinkData.photoUrl
      }
    });
    
    // Se houver ingredientes para atualizar
    if (ingredientes && ingredientes.length > 0) {
      // Remover ingredientes existentes
      await this.prisma.receitadrink.deleteMany({
        where: { drink_id: id }
      });
      
      // Adicionar novos ingredientes
      for (const ingrediente of ingredientes) {
        await this.prisma.receitadrink.create({
          data: {
            drink_id: id,
            ingrediente_id: ingrediente.ingredienteId,
            quantidade_necessaria: ingrediente.quantidade
          }
        });
      }
    }
    
    // Buscar o drink atualizado
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Remover ingredientes da receita
        await tx.receitadrink.deleteMany({
          where: { drink_id: id }
        });
        
        // Remover o drink
        await tx.drink.delete({
          where: { drink_id: id }
        });
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir drink:', error);
      return false;
    }
  }

  async findByName(name: string): Promise<IDrink[]> {
    const drinks = await this.prisma.drink.findMany({
      where: {
        nome: {
          contains: name,
          mode: 'insensitive'
        }
      },
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
    
    return drinks.map(drink => this.mapDrinkToDTO(drink));
  }

  async findByCategory(category: string): Promise<IDrink[]> {
    const drinks = await this.prisma.drink.findMany({
      where: {
        categoria: category
      },
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
    
    return drinks.map(drink => this.mapDrinkToDTO(drink));
  }

  async findRecipeByDrinkId(id: number): Promise<any> {
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id },
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
    
    if (!drink) {
      return null;
    }
    
    return {
      id: drink.drink_id,
      nome: drink.nome,
      preparation: drink.preparation,
      ingredientes: drink.receitadrink.map(receita => ({
        id: receita.ingrediente.ingrediente_id,
        nome: receita.ingrediente.nome,
        quantidade: receita.quantidade_necessaria,
        unidadeMedida: receita.ingrediente.unidademedida?.abreviacao || 'un'
      }))
    };
  }

  async findRelatedDrinks(id: number): Promise<IDrink[]> {
    // Buscar o drink atual
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id },
      include: {
        receitadrink: true
      }
    });
    
    if (!drink) {
      return [];
    }
    
    // Buscar ingredientes do drink
    const ingredienteIds = drink.receitadrink.map(receita => receita.ingrediente_id);
    
    // Buscar drinks que usam ingredientes similares
    const relatedDrinks = await this.prisma.drink.findMany({
      where: {
        drink_id: {
          not: id
        },
        receitadrink: {
          some: {
            ingrediente_id: {
              in: ingredienteIds
            }
          }
        }
      },
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
      },
      take: 5
    });
    
    return relatedDrinks.map(drink => this.mapDrinkToDTO(drink));
  }

  async calculateCost(id: number): Promise<number> {
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id },
      include: {
        receitadrink: {
          include: {
            ingrediente: true
          }
        }
      }
    });
    
    if (!drink) {
      return 0;
    }
    
    let totalCost = 0;
    
    for (const receita of drink.receitadrink) {
      if (receita.ingrediente.custo) {
        totalCost += receita.ingrediente.custo * receita.quantidade_necessaria;
      }
    }
    
    return totalCost;
  }

  private mapDrinkToDTO(drink: any): IDrink {
    return {
      id: drink.drink_id,
      nome: drink.nome,
      descricao: drink.descricao,
      categoria: drink.categoria,
      preparation: drink.preparation,
      photoUrl: drink.photo_url,
      ingredientes: drink.receitadrink.map((receita: any) => ({
        id: receita.ingrediente.ingrediente_id,
        nome: receita.ingrediente.nome,
        quantidade: receita.quantidade_necessaria,
        unidadeMedida: receita.ingrediente.unidademedida?.abreviacao || 'un'
      }))
    };
  }
}
