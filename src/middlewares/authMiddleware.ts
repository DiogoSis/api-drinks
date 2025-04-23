import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';
import { config } from '../config/auth';

interface TokenPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    throw new UnauthorizedError('Erro no formato do token');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    throw new UnauthorizedError('Token mal formatado');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    
    // Adiciona o ID do usuário e o papel ao objeto de requisição
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    return next();
  } catch (error) {
    throw new UnauthorizedError('Token inválido');
  }
};
