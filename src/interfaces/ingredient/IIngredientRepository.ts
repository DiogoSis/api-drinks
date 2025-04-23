import { IIngredient } from './IIngredient';
import { CreateIngredientDTOType, UpdateIngredientDTOType } from '../../dtos/ingredient.dto';

export interface IIngredientRepository {
  findAll(filters?: any): Promise<IIngredient[]>;
  findById(id: number): Promise<IIngredient | null>;
  create(data: CreateIngredientDTOType): Promise<IIngredient>;
  update(id: number, data: UpdateIngredientDTOType): Promise<IIngredient | null>;
  delete(id: number): Promise<boolean>;
  getStock(id: number): Promise<number>;
  updateStock(id: number, quantity: number, motivo: string): Promise<boolean>;
  findLowStock(): Promise<IIngredient[]>;
  findSuppliers(id: number): Promise<any[]>;
  findHistory(id: number, dataInicio?: string, dataFim?: string): Promise<any[]>;
}
