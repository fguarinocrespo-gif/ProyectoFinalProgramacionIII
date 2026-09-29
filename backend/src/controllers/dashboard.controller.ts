import { Request, Response, NextFunction } from 'express';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { Pago } from '../models/pago.model';

export const obtenerResumen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filtroFecha: any = {};

    if (req.query.desde || req.query.hasta) {
      filtroFecha.fechaHora = {};
      if (req.query.desde) filtroFecha.fechaHora.$gte = new Date(req.query.desde as string);
      if (req.query.hasta) filtroFecha.fechaHora.$lte = new Date(req.query.hasta as string);
    }

    // Actas agrupadas por estado
    const actasPorEstado = await ActaInfraccion.aggregate([
      { $match: filtroFecha },
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 },
          montoTotal: { $sum: '$monto' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Total de actas en el período
    const totalActas = actasPorEstado.reduce((sum, g) => sum + g.cantidad, 0);

    // Recaudación del período (pagos realizados)
    const filtroPago: any = {};
    if (req.query.desde || req.query.hasta) {
      filtroPago.fechaPago = {};
      if (req.query.desde) filtroPago.fechaPago.$gte = new Date(req.query.desde as string);
      if (req.query.hasta) filtroPago.fechaPago.$lte = new Date(req.query.hasta as string);
    }

    const recaudacion = await Pago.aggregate([
      { $match: filtroPago },
      {
        $group: {
          _id: null,
          totalRecaudado: { $sum: '$monto' },
          cantidadPagos: { $sum: 1 },
        },
      },
    ]);

    // Recaudación por medio de pago
    const recaudacionPorMedio = await Pago.aggregate([
      { $match: filtroPago },
      {
        $group: {
          _id: '$medioPago',
          total: { $sum: '$monto' },
          cantidad: { $sum: 1 },
        },
      },
    ]);

    res.json({
      actasPorEstado,
      totalActas,
      recaudacion: recaudacion[0] || { totalRecaudado: 0, cantidadPagos: 0 },
      recaudacionPorMedio,
    });
  } catch (error) {
    next(error);
  }
};
