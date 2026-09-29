import { Router } from 'express';
import { registrarPago, listarPagos } from '../controllers/pagos.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { pagoSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar pago de un acta (solo administrativo)
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actaId, monto, medioPago]
 *             properties:
 *               actaId:
 *                 type: string
 *               monto:
 *                 type: number
 *               medioPago:
 *                 type: string
 *                 enum: [contado, tarjeta]
 *               comprobante:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago registrado
 *       400:
 *         description: Estado del acta no permite pago
 */
router.post(
  '/',
  auth,
  roleGuard('administrativo'),
  validate(pagoSchema),
  registrarPago
);

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Listar pagos (filtrable por actaId)
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: actaId
 *         schema:
 *           type: string
 *         description: Filtrar por acta
 *     responses:
 *       200:
 *         description: Lista de pagos
 */
router.get('/', auth, roleGuard('administrativo'), listarPagos);

export default router;
