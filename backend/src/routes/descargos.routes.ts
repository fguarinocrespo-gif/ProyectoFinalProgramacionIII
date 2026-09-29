import { Router } from 'express';
import {
  registrarDescargo,
  cambiarEstadoDescargo,
  listarDescargos,
} from '../controllers/descargos.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { descargoSchema, cambioEstadoDescargoSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /descargos:
 *   post:
 *     summary: Registrar descargo de un acta (solo administrativo)
 *     tags: [Descargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actaId, motivo]
 *             properties:
 *               actaId:
 *                 type: string
 *               motivo:
 *                 type: string
 *               documentacionAdjunta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Descargo registrado
 */
router.post(
  '/',
  auth,
  roleGuard('administrativo'),
  validate(descargoSchema),
  registrarDescargo
);

/**
 * @swagger
 * /descargos:
 *   get:
 *     summary: Listar descargos (filtrable por actaId)
 *     tags: [Descargos]
 *     parameters:
 *       - in: query
 *         name: actaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de descargos
 */
router.get('/', auth, roleGuard('administrativo'), listarDescargos);

/**
 * @swagger
 * /descargos/{id}/estado:
 *   patch:
 *     summary: Aceptar o rechazar descargo
 *     tags: [Descargos]
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
 *                 enum: [aceptado, rechazado]
 *     responses:
 *       200:
 *         description: Estado del descargo actualizado
 */
router.patch(
  '/:id/estado',
  auth,
  roleGuard('administrativo'),
  validate(cambioEstadoDescargoSchema),
  cambiarEstadoDescargo
);

export default router;
