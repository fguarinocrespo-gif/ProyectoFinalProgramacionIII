import { Request, Response, NextFunction } from 'express';
import { TipoInfraccion } from '../models/tipoInfraccion.model';

export const listarTiposInfraccion = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tipos = await TipoInfraccion.find().sort({ codigo: 1 });
    res.json(tipos);
  } catch (error) {
    next(error);
  }
};

export const crearTipoInfraccion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tipo = await TipoInfraccion.create(req.body);
    res.status(201).json(tipo);
  } catch (error) {
    next(error);
  }
};

export const actualizarTipoInfraccion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tipo = await TipoInfraccion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tipo) {
      res.status(404).json({ message: 'Tipo de infracción no encontrado' });
      return;
    }
    res.json(tipo);
  } catch (error) {
    next(error);
  }
};
