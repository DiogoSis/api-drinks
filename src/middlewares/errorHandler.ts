import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.stack}`);

  // Se for um erro da aplicação (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Erros não tratados (genéricos)
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};

// Middleware para capturar rotas não encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
};
