import { Request, Response, NextFunction } from 'express';
import { Vehiculo } from '../models/vehiculo.model';
import { ActaInfraccion } from '../models/actaInfraccion.model';

export const listarVehiculos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculos = await Vehiculo.find()
      .populate('titularId', 'nombre apellido dni')
      .sort({ createdAt: -1 });
    res.json(vehiculos);
  } catch (error) {
    next(error);
  }
};

export const obtenerVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id).populate(
      'titularId',
      'nombre apellido dni'
    );
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }
    res.json(vehiculo);
  } catch (error) {
    next(error);
  }
};

export const crearVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculo = await Vehiculo.create(req.body);
    const vehiculoPopulated = await vehiculo.populate('titularId', 'nombre apellido dni');
    res.status(201).json(vehiculoPopulated);
  } catch (error) {
    next(error);
  }
};

export const actualizarVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculo = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('titularId', 'nombre apellido dni');
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }
    res.json(vehiculo);
  } catch (error) {
    next(error);
  }
};

export const eliminarVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }
    res.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerDeudaVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id).populate(
      'titularId',
      'nombre apellido dni'
    );
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }

    const actas = await ActaInfraccion.find({
      vehiculoId: req.params.id,
      estado: { $in: ['pendiente', 'notificada'] },
    });

    const deudaTotal = actas.reduce((sum, acta) => sum + acta.monto, 0);

    res.json({
      vehiculo,
      cantidadActasPendientes: actas.length,
      deudaTotal,
    });
  } catch (error) {
    next(error);
  }
};
