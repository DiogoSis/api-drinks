import { z } from 'zod';

// DTO para validação de criação de ingrediente
export const CreateIngredientDTO = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  unidadeMedidaId: z.number().int().positive('ID da unidade de medida deve ser positivo'),
  estoqueMinimo: z.number().nonnegative('Estoque mínimo não pode ser negativo').optional(),
  estoqueAtual: z.number().nonnegative('Estoque atual não pode ser negativo').optional().default(0),
  custo: z.number().nonnegative('Custo não pode ser negativo').optional()
});

// DTO para validação de atualização de ingrediente
export const UpdateIngredientDTO = CreateIngredientDTO.partial();

// DTO para validação de atualização de estoque
export const UpdateStockDTO = z.object({
  quantidade: z.number().nonnegative('Quantidade não pode ser negativa'),
  motivo: z.string().optional()
});

// DTO para validação de movimentação de estoque
export const StockMovementDTO = z.object({
  ingredienteId: z.number().int().positive('ID do ingrediente deve ser positivo'),
  quantidade: z.number().nonzero('Quantidade não pode ser zero'),
  tipo: z.enum(['entrada', 'saida']),
  motivo: z.string().min(3, 'Motivo deve ter pelo menos 3 caracteres'),
  fornecedorId: z.number().int().positive('ID do fornecedor deve ser positivo').optional()
});

// DTO para validação de ajuste de estoque
export const StockAdjustmentDTO = z.object({
  ingredienteId: z.number().int().positive('ID do ingrediente deve ser positivo'),
  quantidadeNova: z.number().nonnegative('Nova quantidade não pode ser negativa'),
  motivo: z.string().min(3, 'Motivo deve ter pelo menos 3 caracteres')
});

// Tipos inferidos dos DTOs
export type CreateIngredientDTOType = z.infer<typeof CreateIngredientDTO>;
export type UpdateIngredientDTOType = z.infer<typeof UpdateIngredientDTO>;
export type UpdateStockDTOType = z.infer<typeof UpdateStockDTO>;
export type StockMovementDTOType = z.infer<typeof StockMovementDTO>;
export type StockAdjustmentDTOType = z.infer<typeof StockAdjustmentDTO>;
