import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err.message, { stack: err.stack });

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Error de validación',
      errors: err.message,
    });
    return;
  }

  // Error de cast de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'ID inválido',
    });
    return;
  }

  // Error de duplicado de Mongoose (unique constraint)
  if ((err as any).code === 11000) {
    res.status(409).json({
      message: 'El registro ya existe (valor duplicado)',
    });
    return;
  }

  res.status(500).json({
    message: 'Error interno del servidor',
  });
};
