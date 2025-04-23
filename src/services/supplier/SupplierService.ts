import { ISupplierService } from '../../interfaces/supplier/ISupplierService';
import { ISupplierRepository } from '../../interfaces/supplier/ISupplierRepository';
import { IIngredientRepository } from '../../interfaces/ingredient/IIngredientRepository';
import { CreateSupplierDTOType, SupplierIngredientDTOType, UpdateSupplierDTOType } from '../../dtos/supplier.dto';
import { NotFoundError } from '../../errors/AppError';

export class SupplierService implements ISupplierService {
  constructor(
    private supplierRepository: ISupplierRepository,
    private ingredientRepository: IIngredientRepository
  ) {}

  async getAllSuppliers(pagination?: { page: number; limit: number }) {
    return this.supplierRepository.findAll(pagination);
  }

  async getSupplierById(id: number) {
    return this.supplierRepository.findById(id);
  }

  async createSupplier(data: CreateSupplierDTOType) {
    return this.supplierRepository.create(data);
  }

  async updateSupplier(id: number, data: UpdateSupplierDTOType) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      return null;
    }

    return this.supplierRepository.update(id, data);
  }

  async deleteSupplier(id: number) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      return false;
    }

    return this.supplierRepository.delete(id);
  }

  async searchSuppliersByName(name: string) {
    return this.supplierRepository.findByName(name);
  }

  async getSupplierIngredients(id: number) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      return null;
    }

    return this.supplierRepository.findIngredients(id);
  }

  async addIngredientToSupplier(id: number, data: SupplierIngredientDTOType) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      return null;
    }

    const ingredient = await this.ingredientRepository.findById(data.ingredienteId);
    if (!ingredient) {
      throw new NotFoundError(`Ingrediente com ID ${data.ingredienteId} não encontrado`);
    }

    return this.supplierRepository.addIngredient(id, data);
  }

  async removeIngredientFromSupplier(supplierId: number, ingredientId: number) {
    const supplier = await this.supplierRepository.findById(supplierId);
    if (!supplier) {
      return false;
    }

    const ingredient = await this.ingredientRepository.findById(ingredientId);
    if (!ingredient) {
      throw new NotFoundError(`Ingrediente com ID ${ingredientId} não encontrado`);
    }

    return this.supplierRepository.removeIngredient(supplierId, ingredientId);
  }

  async getReplenishmentSuggestions() {
    // Obter ingredientes com estoque baixo
    const lowStockIngredients = await this.ingredientRepository.findLowStock();
    
    // Para cada ingrediente, encontrar o melhor fornecedor
    const suggestions = [];
    
    for (const ingredient of lowStockIngredients) {
      const suppliers = await this.ingredientRepository.findSuppliers(ingredient.id);
      
      if (suppliers && suppliers.length > 0) {
        // Ordenar fornecedores por preço e prazo de entrega
        const bestSupplier = suppliers.sort((a, b) => {
          // Priorizar preço mais baixo
          if (a.precoUnitario !== b.precoUnitario) {
            return a.precoUnitario - b.precoUnitario;
          }
          // Em caso de empate, priorizar prazo de entrega mais curto
          return a.prazoEntrega - b.prazoEntrega;
        })[0];
        
        suggestions.push({
          ingrediente: ingredient,
          fornecedor: bestSupplier,
          quantidadeRecomendada: Math.max(ingredient.estoqueMinimo - ingredient.estoqueAtual, 0) * 1.5 // 50% a mais que o mínimo necessário
        });
      }
    }
    
    return suggestions;
  }
}
