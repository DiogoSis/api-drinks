import { IIngredientService } from '../../interfaces/ingredient/IIngredientService';
import { IIngredientRepository } from '../../interfaces/ingredient/IIngredientRepository';
import { CreateIngredientDTOType, UpdateIngredientDTOType, UpdateStockDTOType } from '../../dtos/ingredient.dto';

export class IngredientService implements IIngredientService {
  constructor(private ingredientRepository: IIngredientRepository) {}

  async getAllIngredients(filters?: any) {
    return this.ingredientRepository.findAll(filters);
  }

  async getIngredientById(id: number) {
    return this.ingredientRepository.findById(id);
  }

  async createIngredient(data: CreateIngredientDTOType) {
    return this.ingredientRepository.create(data);
  }

  async updateIngredient(id: number, data: UpdateIngredientDTOType) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return null;
    }

    return this.ingredientRepository.update(id, data);
  }

  async deleteIngredient(id: number) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return false;
    }

    return this.ingredientRepository.delete(id);
  }

  async getIngredientStock(id: number) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return null;
    }

    const stock = await this.ingredientRepository.getStock(id);
    return {
      id,
      nome: ingredient.nome,
      estoqueAtual: stock,
      estoqueMinimo: ingredient.estoqueMinimo
    };
  }

  async updateIngredientStock(id: number, data: UpdateStockDTOType) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return null;
    }

    const currentStock = await this.ingredientRepository.getStock(id);
    const newStock = currentStock + data.quantidade;

    await this.ingredientRepository.updateStock(id, newStock, data.motivo);

    return {
      id,
      nome: ingredient.nome,
      estoqueAnterior: currentStock,
      estoqueAtual: newStock,
      diferenca: data.quantidade,
      motivo: data.motivo
    };
  }

  async getLowStockIngredients() {
    return this.ingredientRepository.findLowStock();
  }

  async getIngredientSuppliers(id: number) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return null;
    }

    return this.ingredientRepository.findSuppliers(id);
  }

  async getIngredientHistory(id: number, dataInicio?: string, dataFim?: string) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return null;
    }

    return this.ingredientRepository.findHistory(id, dataInicio, dataFim);
  }
}
