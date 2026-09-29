import { Request, Response, NextFunction } from 'express';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { TipoInfraccion } from '../models/tipoInfraccion.model';
import { Vehiculo } from '../models/vehiculo.model';
import { logger } from '../utils/logger';

export const listarActas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const filtro: any = {};

    if (req.query.estado) {
      filtro.estado = req.query.estado;
    }

    if (req.query.desde || req.query.hasta) {
      filtro.fechaHora = {};
      if (req.query.desde) filtro.fechaHora.$gte = new Date(req.query.desde as string);
      if (req.query.hasta) filtro.fechaHora.$lte = new Date(req.query.hasta as string);
    }

    // Filtro por patente: buscar vehículos que coincidan y filtrar por sus IDs
    if (req.query.patente) {
      const vehiculos = await Vehiculo.find({
        patente: { $regex: req.query.patente as string, $options: 'i' },
      });
      filtro.vehiculoId = { $in: vehiculos.map((v) => v._id) };
    }

    // Si es inspector, solo ve sus propias actas
    if (req.usuario?.rol === 'inspector') {
      filtro.inspectorId = req.usuario.id;
    }

    const [actas, total] = await Promise.all([
      ActaInfraccion.find(filtro)
        .populate('vehiculoId', 'patente marca modelo')
        .populate('tipoInfraccionId', 'codigo descripcion')
        .populate('inspectorId', 'nombre apellido')
        .sort({ fechaHora: -1 })
        .skip(skip)
        .limit(limit),
      ActaInfraccion.countDocuments(filtro),
    ]);

    res.json({
      data: actas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerActa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const acta = await ActaInfraccion.findById(req.params.id)
      .populate({
        path: 'vehiculoId',
        populate: { path: 'titularId', select: 'nombre apellido dni' },
      })
      .populate('tipoInfraccionId')
      .populate('inspectorId', 'nombre apellido email');

    if (!acta) {
      res.status(404).json({ message: 'Acta no encontrada' });
      return;
    }
    res.json(acta);
  } catch (error) {
    next(error);
  }
};

export const crearActa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { vehiculoId, tipoInfraccionId, lugar, fechaHora, observaciones } = req.body;

    // Verificar que el vehículo existe
    const vehiculo = await Vehiculo.findById(vehiculoId);
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }

    // Obtener el monto del tipo de infracción
    const tipoInfraccion = await TipoInfraccion.findById(tipoInfraccionId);
    if (!tipoInfraccion) {
      res.status(404).json({ message: 'Tipo de infracción no encontrado' });
      return;
    }

    const acta = await ActaInfraccion.create({
      vehiculoId,
      tipoInfraccionId,
      inspectorId: req.usuario!.id,
      lugar,
      fechaHora: fechaHora || new Date(),
      monto: tipoInfraccion.montoBase,
      observaciones: observaciones || '',
    });

    const actaPopulated = await acta.populate([
      { path: 'vehiculoId', select: 'patente marca modelo' },
      { path: 'tipoInfraccionId', select: 'codigo descripcion' },
      { path: 'inspectorId', select: 'nombre apellido' },
    ]);

    logger.info(
      `Acta #${acta.numeroActa} labrada por inspector ${req.usuario!.email} para vehículo ${vehiculo.patente}`
    );

    res.status(201).json(actaPopulated);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoActa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { estado } = req.body;

    const acta = await ActaInfraccion.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!acta) {
      res.status(404).json({ message: 'Acta no encontrada' });
      return;
    }

    logger.info(`Acta #${acta.numeroActa} cambió de estado a: ${estado}`);

    res.json(acta);
  } catch (error) {
    next(error);
  }
};
