import { z } from 'zod';

// DTO para validação de criação de pedido
export const CreateOrderDTO = z.object({
  clienteNome: z.string().min(3, 'Nome do cliente deve ter pelo menos 3 caracteres'),
  mesa: z.number().int().positive().optional(),
  itens: z.array(
    z.object({
      drinkId: z.number().int().positive('ID do drink deve ser positivo'),
      quantidade: z.number().int().positive('Quantidade deve ser positiva'),
      observacao: z.string().optional()
    })
  ).min(1, 'Pedido deve ter pelo menos um item')
});

// DTO para validação de atualização de status do pedido
export const UpdateOrderStatusDTO = z.object({
  status: z.enum(['pendente', 'em_preparo', 'pronto', 'entregue', 'cancelado']),
  observacao: z.string().optional()
});

// DTO para validação de processamento de pedido
export const FulfillOrderDTO = z.object({
  bartenderId: z.number().int().positive('ID do bartender deve ser positivo')
});

// DTO para validação de busca de pedidos
export const SearchOrderDTO = z.object({
  status: z.enum(['pendente', 'em_preparo', 'pronto', 'entregue', 'cancelado']).optional(),
  clienteNome: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10)
});

// Tipos inferidos dos DTOs
export type CreateOrderDTOType = z.infer<typeof CreateOrderDTO>;
export type UpdateOrderStatusDTOType = z.infer<typeof UpdateOrderStatusDTO>;
export type FulfillOrderDTOType = z.infer<typeof FulfillOrderDTO>;
export type SearchOrderDTOType = z.infer<typeof SearchOrderDTO>;
