import { z } from 'zod';

// DTO para validação de criação de drink
export const CreateDrinkDTO = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  preparation: z.string().optional(),
  photoUrl: z.string().url('URL da foto inválida').optional(),
  ingredientes: z.array(
    z.object({
      ingredienteId: z.number().int().positive('ID do ingrediente deve ser positivo'),
      quantidade: z.number().positive('Quantidade deve ser positiva'),
      unidadeMedidaId: z.number().int().positive('ID da unidade de medida deve ser positivo').optional()
    })
  ).min(1, 'Drink deve ter pelo menos um ingrediente')
});

// DTO para validação de atualização de drink
export const UpdateDrinkDTO = CreateDrinkDTO.partial();

// DTO para validação de busca de drinks
export const SearchDrinkDTO = z.object({
  nome: z.string().optional(),
  categoria: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10)
});

// DTO para validação de verificação de estoque
export const StockCheckDTO = z.object({
  quantidade: z.number().int().positive('Quantidade deve ser positiva')
});

// Tipos inferidos dos DTOs
export type CreateDrinkDTOType = z.infer<typeof CreateDrinkDTO>;
export type UpdateDrinkDTOType = z.infer<typeof UpdateDrinkDTO>;
export type SearchDrinkDTOType = z.infer<typeof SearchDrinkDTO>;
export type StockCheckDTOType = z.infer<typeof StockCheckDTO>;
