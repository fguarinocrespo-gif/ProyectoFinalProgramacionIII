import { Router } from 'express';
import {
  listarActas,
  obtenerActa,
  crearActa,
  cambiarEstadoActa,
} from '../controllers/actas.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { actaInfraccionSchema, cambioEstadoActaSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /actas:
 *   get:
 *     summary: Listar actas con paginación y filtros
 *     tags: [Actas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad por página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, notificada, pagada, en_descargo, anulada]
 *         description: Filtrar por estado
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta
 *       - in: query
 *         name: patente
 *         schema:
 *           type: string
 *         description: Filtrar por patente (parcial)
 *     responses:
 *       200:
 *         description: Lista paginada de actas
 */
router.get('/', auth, listarActas);

/**
 * @swagger
 * /actas/{id}:
 *   get:
 *     summary: Obtener acta por ID
 *     tags: [Actas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del acta
 *       404:
 *         description: Acta no encontrada
 */
router.get('/:id', auth, obtenerActa);

/**
 * @swagger
 * /actas:
 *   post:
 *     summary: Labrar nueva acta de infracción (solo inspector)
 *     tags: [Actas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehiculoId, tipoInfraccionId, lugar]
 *             properties:
 *               vehiculoId:
 *                 type: string
 *               tipoInfraccionId:
 *                 type: string
 *               lugar:
 *                 type: string
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Acta creada
 */
router.post(
  '/',
  auth,
  roleGuard('inspector'),
  validate(actaInfraccionSchema),
  crearActa
);

/**
 * @swagger
 * /actas/{id}/estado:
 *   patch:
 *     summary: Cambiar estado del acta
 *     tags: [Actas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, notificada, pagada, en_descargo, anulada]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch(
  '/:id/estado',
  auth,
  roleGuard('administrativo'),
  validate(cambioEstadoActaSchema),
  cambiarEstadoActa
);

export default router;
