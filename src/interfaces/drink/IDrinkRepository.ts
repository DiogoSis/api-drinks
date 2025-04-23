import { IDrink } from './IDrink';
import { CreateDrinkDTOType, SearchDrinkDTOType, UpdateDrinkDTOType } from '../../dtos/drink.dto';

export interface IDrinkRepository {
  findAll(filters?: SearchDrinkDTOType): Promise<IDrink[]>;
  findById(id: number): Promise<IDrink | null>;
  create(data: CreateDrinkDTOType): Promise<IDrink>;
  update(id: number, data: UpdateDrinkDTOType): Promise<IDrink | null>;
  delete(id: number): Promise<boolean>;
  findByName(name: string): Promise<IDrink[]>;
  findByCategory(category: string): Promise<IDrink[]>;
  findRecipeByDrinkId(id: number): Promise<any>;
  findRelatedDrinks(id: number): Promise<IDrink[]>;
  calculateCost(id: number): Promise<number>;
}
