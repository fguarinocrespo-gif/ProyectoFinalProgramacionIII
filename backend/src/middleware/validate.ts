import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        campo: e.path.join('.'),
        mensaje: e.message,
      }));
      res.status(400).json({ message: 'Error de validación', errors });
      return;
    }
    req.body = result.data;
    next();
  };
};
