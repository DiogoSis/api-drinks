import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationError } from '../errors/AppError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida o corpo da requisição, parâmetros de rota e query strings
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      
      return next();
    } catch (error: any) {
      // Formata os erros de validação do Zod
      const formattedErrors = error.errors?.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      throw new ValidationError(
        `Erro de validação: ${formattedErrors?.[0]?.message || 'Dados inválidos'}`,
      );
    }
  };
};
