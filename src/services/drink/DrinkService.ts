import { IDrinkService } from '../../interfaces/drink/IDrinkService';
import { IDrinkRepository } from '../../interfaces/drink/IDrinkRepository';
import { IIngredientRepository } from '../../interfaces/ingredient/IIngredientRepository';
import { CreateDrinkDTOType, SearchDrinkDTOType, UpdateDrinkDTOType } from '../../dtos/drink.dto';
import { NotFoundError } from '../../errors/AppError';

export class DrinkService implements IDrinkService {
  constructor(
    private drinkRepository: IDrinkRepository,
    private ingredientRepository: IIngredientRepository
  ) {}

  async getAllDrinks(filters?: SearchDrinkDTOType) {
    return this.drinkRepository.findAll(filters);
  }

  async getDrinkById(id: number) {
    return this.drinkRepository.findById(id);
  }

  async createDrink(data: CreateDrinkDTOType) {
    // Verificar se todos os ingredientes existem
    for (const ingrediente of data.ingredientes) {
      const ingredienteExists = await this.ingredientRepository.findById(ingrediente.ingredienteId);
      if (!ingredienteExists) {
        throw new NotFoundError(`Ingrediente com ID ${ingrediente.ingredienteId} não encontrado`);
      }
    }

    return this.drinkRepository.create(data);
  }

  async updateDrink(id: number, data: UpdateDrinkDTOType) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return null;
    }

    // Se houver ingredientes para atualizar, verificar se todos existem
    if (data.ingredientes) {
      for (const ingrediente of data.ingredientes) {
        const ingredienteExists = await this.ingredientRepository.findById(ingrediente.ingredienteId);
        if (!ingredienteExists) {
          throw new NotFoundError(`Ingrediente com ID ${ingrediente.ingredienteId} não encontrado`);
        }
      }
    }

    return this.drinkRepository.update(id, data);
  }

  async deleteDrink(id: number) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return false;
    }

    return this.drinkRepository.delete(id);
  }

  async searchDrinksByName(name: string) {
    return this.drinkRepository.findByName(name);
  }

  async getDrinksByCategory(category: string) {
    return this.drinkRepository.findByCategory(category);
  }

  async getDrinkRecipe(id: number) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return null;
    }

    return this.drinkRepository.findRecipeByDrinkId(id);
  }

  async checkDrinkStock(id: number, quantity: number) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return null;
    }

    // Verificar disponibilidade de cada ingrediente
    const result = {
      disponivel: true,
      ingredientes: []
    };

    for (const ingrediente of drink.ingredientes) {
      const ingredienteEstoque = await this.ingredientRepository.getStock(ingrediente.id);
      const quantidadeNecessaria = ingrediente.quantidade * quantity;
      const disponivel = ingredienteEstoque >= quantidadeNecessaria;

      result.ingredientes.push({
        id: ingrediente.id,
        nome: ingrediente.nome,
        disponivel,
        quantidadeNecessaria,
        estoqueAtual: ingredienteEstoque
      });

      if (!disponivel) {
        result.disponivel = false;
      }
    }

    return result;
  }

  async calculateDrinkCost(id: number) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return null;
    }

    let totalCost = 0;

    for (const ingrediente of drink.ingredientes) {
      const ingredienteData = await this.ingredientRepository.findById(ingrediente.id);
      if (ingredienteData && ingredienteData.custo) {
        totalCost += ingredienteData.custo * ingrediente.quantidade;
      }
    }

    return totalCost;
  }

  async getRelatedDrinks(id: number) {
    const drink = await this.drinkRepository.findById(id);
    if (!drink) {
      return null;
    }

    return this.drinkRepository.findRelatedDrinks(id);
  }
}
