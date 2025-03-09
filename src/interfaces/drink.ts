export interface IDrinkIngredient {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
}

export interface IDrink {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  preparation?: string;
  photoUrl?: string;
  ingredientes: IDrinkIngredient[];
}

export interface IDrinkRepository {
  findAll(): Promise<IDrink[]>;
  findById(id: number): Promise<IDrink | null>;
}

export interface IDrinkService {
  getAllDrinks(): Promise<IDrink[]>;
  getDrinkById(id: number): Promise<IDrink | null>;
}
