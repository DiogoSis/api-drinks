export interface IIngredient {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  unidadeMedida: string;
  unidadeMedidaId: number;
  estoqueMinimo?: number;
  estoqueAtual: number;
  custo?: number;
}
