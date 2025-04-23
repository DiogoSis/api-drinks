import { IIngredient } from './IIngredient';
import { CreateIngredientDTOType, UpdateIngredientDTOType, UpdateStockDTOType } from '../../dtos/ingredient.dto';

export interface IIngredientService {
  getAllIngredients(filters?: any): Promise<IIngredient[]>;
  getIngredientById(id: number): Promise<IIngredient | null>;
  createIngredient(data: CreateIngredientDTOType): Promise<IIngredient>;
  updateIngredient(id: number, data: UpdateIngredientDTOType): Promise<IIngredient | null>;
  deleteIngredient(id: number): Promise<boolean>;
  getIngredientStock(id: number): Promise<any | null>;
  updateIngredientStock(id: number, data: UpdateStockDTOType): Promise<any | null>;
  getLowStockIngredients(): Promise<IIngredient[]>;
  getIngredientSuppliers(id: number): Promise<any[] | null>;
  getIngredientHistory(id: number, dataInicio?: string, dataFim?: string): Promise<any[] | null>;
}
