import { z } from 'zod';

// DTO para validação de criação de receita
export const CreateRecipeDTO = z.object({
  drinkId: z.number().int().positive('ID do drink deve ser positivo'),
  ingredienteId: z.number().int().positive('ID do ingrediente deve ser positivo'),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  observacao: z.string().optional()
});

// DTO para validação de atualização de receita
export const UpdateRecipeDTO = z.object({
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  observacao: z.string().optional()
});

// Tipos inferidos dos DTOs
export type CreateRecipeDTOType = z.infer<typeof CreateRecipeDTO>;
export type UpdateRecipeDTOType = z.infer<typeof UpdateRecipeDTO>;
