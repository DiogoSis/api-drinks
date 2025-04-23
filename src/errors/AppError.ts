export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Captura o stack trace para melhor depuração
    Error.captureStackTrace(this, this.constructor);
    
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso proibido') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Erro de validação') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito de recursos') {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Erro interno do servidor') {
    super(message, 500, false);
  }
}
