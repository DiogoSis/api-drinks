export interface IOrderItem {
  id: number;
  drink: {
    id: number;
    nome: string;
    categoria?: string;
  };
  quantidade: number;
  observacao?: string;
  precoUnitario: number;
  precoTotal: number;
}

export interface IOrder {
  id: number;
  clienteNome: string;
  mesa?: number;
  status: string;
  observacao?: string;
  dataCriacao: Date;
  valorTotal: number;
  bartender?: {
    id: number;
    nome: string;
  } | null;
  itens: IOrderItem[];
}
