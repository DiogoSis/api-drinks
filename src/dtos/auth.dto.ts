import { z } from 'zod';

// DTO para validação de criação de usuário
export const CreateUserDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'user', 'bartender']).optional().default('user')
});

// DTO para validação de login
export const LoginDTO = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

// DTO para validação de refresh token
export const RefreshTokenDTO = z.object({
  refreshToken: z.string().min(1, 'Token de atualização é obrigatório')
});

// Tipos inferidos dos DTOs
export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;
export type LoginDTOType = z.infer<typeof LoginDTO>;
export type RefreshTokenDTOType = z.infer<typeof RefreshTokenDTO>;
