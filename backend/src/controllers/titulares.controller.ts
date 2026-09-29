import { Request, Response, NextFunction } from 'express';
import { Titular } from '../models/titular.model';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { Vehiculo } from '../models/vehiculo.model';

export const listarTitulares = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titulares = await Titular.find().sort({ createdAt: -1 });
    res.json(titulares);
  } catch (error) {
    next(error);
  }
};

export const obtenerTitular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titular = await Titular.findById(req.params.id);
    if (!titular) {
      res.status(404).json({ message: 'Titular no encontrado' });
      return;
    }
    res.json(titular);
  } catch (error) {
    next(error);
  }
};

export const crearTitular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titular = await Titular.create(req.body);
    res.status(201).json(titular);
  } catch (error) {
    next(error);
  }
};

export const actualizarTitular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titular = await Titular.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!titular) {
      res.status(404).json({ message: 'Titular no encontrado' });
      return;
    }
    res.json(titular);
  } catch (error) {
    next(error);
  }
};

export const eliminarTitular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titular = await Titular.findByIdAndDelete(req.params.id);
    if (!titular) {
      res.status(404).json({ message: 'Titular no encontrado' });
      return;
    }
    res.json({ message: 'Titular eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerDeudaTitular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const titular = await Titular.findById(req.params.id);
    if (!titular) {
      res.status(404).json({ message: 'Titular no encontrado' });
      return;
    }

    // Obtener todos los vehículos del titular
    const vehiculos = await Vehiculo.find({ titularId: req.params.id });
    const vehiculoIds = vehiculos.map((v) => v._id);

    // Sumar las actas pendientes/notificadas de esos vehículos
    const actas = await ActaInfraccion.find({
      vehiculoId: { $in: vehiculoIds },
      estado: { $in: ['pendiente', 'notificada'] },
    });

    const deudaTotal = actas.reduce((sum, acta) => sum + acta.monto, 0);

    res.json({
      titular,
      cantidadVehiculos: vehiculos.length,
      cantidadActasPendientes: actas.length,
      deudaTotal,
    });
  } catch (error) {
    next(error);
  }
};
