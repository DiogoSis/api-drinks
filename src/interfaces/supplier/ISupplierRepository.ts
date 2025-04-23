import { ISupplier } from './ISupplier';
import { CreateSupplierDTOType, SupplierIngredientDTOType, UpdateSupplierDTOType } from '../../dtos/supplier.dto';

export interface ISupplierRepository {
  findAll(pagination?: { page: number; limit: number }): Promise<ISupplier[]>;
  findById(id: number): Promise<ISupplier | null>;
  create(data: CreateSupplierDTOType): Promise<ISupplier>;
  update(id: number, data: UpdateSupplierDTOType): Promise<ISupplier | null>;
  delete(id: number): Promise<boolean>;
  findByName(name: string): Promise<ISupplier[]>;
  findIngredients(id: number): Promise<any[]>;
  addIngredient(id: number, data: SupplierIngredientDTOType): Promise<any>;
  removeIngredient(supplierId: number, ingredientId: number): Promise<boolean>;
}
