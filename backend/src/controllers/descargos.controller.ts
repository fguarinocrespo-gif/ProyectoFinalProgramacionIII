import { Request, Response, NextFunction } from 'express';
import { Descargo } from '../models/descargo.model';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { logger } from '../utils/logger';

export const registrarDescargo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { actaId, motivo, documentacionAdjunta } = req.body;

    // Verificar que el acta existe
    const acta = await ActaInfraccion.findById(actaId);
    if (!acta) {
      res.status(404).json({ message: 'Acta no encontrada' });
      return;
    }

    if (!['pendiente', 'notificada'].includes(acta.estado)) {
      res.status(400).json({
        message: `No se puede registrar un descargo para un acta en estado "${acta.estado}"`,
      });
      return;
    }

    const descargo = await Descargo.create({
      actaId,
      registradoPorId: req.usuario!.id,
      motivo,
      documentacionAdjunta,
    });

    // Cambiar estado del acta a en_descargo
    acta.estado = 'en_descargo';
    await acta.save();

    logger.info(`Descargo registrado para acta #${acta.numeroActa}`);

    res.status(201).json(descargo);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoDescargo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { estado } = req.body; // 'aceptado' o 'rechazado'

    const descargo = await Descargo.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!descargo) {
      res.status(404).json({ message: 'Descargo no encontrado' });
      return;
    }

    // Actualizar el estado del acta según la resolución del descargo
    const acta = await ActaInfraccion.findById(descargo.actaId);
    if (acta) {
      if (estado === 'aceptado') {
        acta.estado = 'anulada';
      } else {
        // rechazado: vuelve a notificada
        acta.estado = 'notificada';
      }
      await acta.save();
      logger.info(
        `Descargo ${estado} para acta #${acta.numeroActa} → estado del acta: ${acta.estado}`
      );
    }

    res.json(descargo);
  } catch (error) {
    next(error);
  }
};

export const listarDescargos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filtro: any = {};
    if (req.query.actaId) {
      filtro.actaId = req.query.actaId;
    }

    const descargos = await Descargo.find(filtro)
      .populate('actaId', 'numeroActa monto estado')
      .populate('registradoPorId', 'nombre apellido')
      .sort({ fechaPresentacion: -1 });

    res.json(descargos);
  } catch (error) {
    next(error);
  }
};
