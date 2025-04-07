export interface IUnidadeMedida {
  id: number;
  nome: string;
  abreviacao: string;
}

export interface ICategoria {
  id: number;
  nome: string;
  tipo: string;
}

export interface IIngrediente {
  id: number;
  nome: string;
  categoria: ICategoria;
  unidadeMedida: IUnidadeMedida
}

export interface IIngredienteRepository {
  findAll(): Promise<IIngrediente[]>;
  findById(id: number): Promise<IIngrediente[] | null>;
}

export interface IIngredienteService {
  getAllIngredientes(): Promise<IIngrediente[]>;
  getIngredienteById(id: number): Promise<IIngrediente | null>;
}

