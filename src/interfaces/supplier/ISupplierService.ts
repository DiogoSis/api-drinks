import { ISupplier } from './ISupplier';
import { CreateSupplierDTOType, SupplierIngredientDTOType, UpdateSupplierDTOType } from '../../dtos/supplier.dto';

export interface ISupplierService {
  getAllSuppliers(pagination?: { page: number; limit: number }): Promise<ISupplier[]>;
  getSupplierById(id: number): Promise<ISupplier | null>;
  createSupplier(data: CreateSupplierDTOType): Promise<ISupplier>;
  updateSupplier(id: number, data: UpdateSupplierDTOType): Promise<ISupplier | null>;
  deleteSupplier(id: number): Promise<boolean>;
  searchSuppliersByName(name: string): Promise<ISupplier[]>;
  getSupplierIngredients(id: number): Promise<any[] | null>;
  addIngredientToSupplier(id: number, data: SupplierIngredientDTOType): Promise<any | null>;
  removeIngredientFromSupplier(supplierId: number, ingredientId: number): Promise<boolean>;
  getReplenishmentSuggestions(): Promise<any[]>;
}
