import { z } from 'zod';

// DTO para validação de criação de fornecedor
export const CreateSupplierDTO = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cnpj: z.string().optional(),
  observacoes: z.string().optional()
});

// DTO para validação de atualização de fornecedor
export const UpdateSupplierDTO = CreateSupplierDTO.partial();

// DTO para validação de associação de ingrediente a fornecedor
export const SupplierIngredientDTO = z.object({
  ingredienteId: z.number().int().positive('ID do ingrediente deve ser positivo'),
  precoUnitario: z.number().positive('Preço unitário deve ser positivo').optional(),
  prazoEntrega: z.number().int().nonnegative('Prazo de entrega não pode ser negativo').optional(),
  observacoes: z.string().optional()
});

// DTO para validação de busca de fornecedores
export const SearchSupplierDTO = z.object({
  nome: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10)
});

// Tipos inferidos dos DTOs
export type CreateSupplierDTOType = z.infer<typeof CreateSupplierDTO>;
export type UpdateSupplierDTOType = z.infer<typeof UpdateSupplierDTO>;
export type SupplierIngredientDTOType = z.infer<typeof SupplierIngredientDTO>;
export type SearchSupplierDTOType = z.infer<typeof SearchSupplierDTO>;
