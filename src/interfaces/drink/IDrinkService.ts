import { IDrink } from './IDrink';
import { CreateDrinkDTOType, SearchDrinkDTOType, UpdateDrinkDTOType } from '../../dtos/drink.dto';

export interface IDrinkService {
  getAllDrinks(filters?: SearchDrinkDTOType): Promise<IDrink[]>;
  getDrinkById(id: number): Promise<IDrink | null>;
  createDrink(data: CreateDrinkDTOType): Promise<IDrink>;
  updateDrink(id: number, data: UpdateDrinkDTOType): Promise<IDrink | null>;
  deleteDrink(id: number): Promise<boolean>;
  searchDrinksByName(name: string): Promise<IDrink[]>;
  getDrinksByCategory(category: string): Promise<IDrink[]>;
  getDrinkRecipe(id: number): Promise<any>;
  checkDrinkStock(id: number, quantity: number): Promise<any>;
  calculateDrinkCost(id: number): Promise<number | null>;
  getRelatedDrinks(id: number): Promise<IDrink[] | null>;
}
