export interface IDrinkIngredient {
  id: number;
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
