import { Request, Response, NextFunction } from 'express';
import { Pago } from '../models/pago.model';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { logger } from '../utils/logger';

export const registrarPago = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { actaId, monto, medioPago, comprobante } = req.body;

    // Verificar que el acta existe y está en estado que permita pago
    const acta = await ActaInfraccion.findById(actaId);
    if (!acta) {
      res.status(404).json({ message: 'Acta no encontrada' });
      return;
    }

    if (!['pendiente', 'notificada'].includes(acta.estado)) {
      res.status(400).json({
        message: `No se puede registrar un pago para un acta en estado "${acta.estado}"`,
      });
      return;
    }

    const pago = await Pago.create({
      actaId,
      registradoPorId: req.usuario!.id,
      monto,
      medioPago,
      comprobante,
    });

    // Cambiar estado del acta a pagada
    acta.estado = 'pagada';
    await acta.save();

    logger.info(`Pago registrado para acta #${acta.numeroActa} por ${medioPago}`);

    res.status(201).json(pago);
  } catch (error) {
    next(error);
  }
};

export const listarPagos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filtro: any = {};
    if (req.query.actaId) {
      filtro.actaId = req.query.actaId;
    }

    const pagos = await Pago.find(filtro)
      .populate('actaId', 'numeroActa monto estado')
      .populate('registradoPorId', 'nombre apellido')
      .sort({ fechaPago: -1 });

    res.json(pagos);
  } catch (error) {
    next(error);
  }
};
