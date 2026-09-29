import { Request, Response, NextFunction } from 'express';

export const roleGuard = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({
        message: 'No tiene permisos para acceder a este recurso',
      });
      return;
    }

    next();
  };
};
