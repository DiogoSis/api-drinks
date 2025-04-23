import { z } from 'zod';

// DTO para validação de criação de categoria
export const CreateCategoryDTO = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  tipo: z.enum(['drink', 'ingrediente']).default('drink')
});

// DTO para validação de atualização de categoria
export const UpdateCategoryDTO = CreateCategoryDTO.partial();

// DTO para validação de criação de unidade de medida
export const CreateUnitDTO = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  abreviacao: z.string().min(1, 'Abreviação é obrigatória'),
  descricao: z.string().optional()
});

// DTO para validação de atualização de unidade de medida
export const UpdateUnitDTO = CreateUnitDTO.partial();

// Tipos inferidos dos DTOs
export type CreateCategoryDTOType = z.infer<typeof CreateCategoryDTO>;
export type UpdateCategoryDTOType = z.infer<typeof UpdateCategoryDTO>;
export type CreateUnitDTOType = z.infer<typeof CreateUnitDTO>;
export type UpdateUnitDTOType = z.infer<typeof UpdateUnitDTO>;
