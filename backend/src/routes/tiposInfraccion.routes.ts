import { Router } from 'express';
import {
  listarTiposInfraccion,
  crearTipoInfraccion,
  actualizarTipoInfraccion,
} from '../controllers/tiposInfraccion.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { tipoInfraccionSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /tipos-infraccion:
 *   get:
 *     summary: Listar tipos de infracción
 *     tags: [Tipos de Infracción]
 *     responses:
 *       200:
 *         description: Lista de tipos de infracción
 */
router.get('/', auth, listarTiposInfraccion);

/**
 * @swagger
 * /tipos-infraccion:
 *   post:
 *     summary: Crear tipo de infracción
 *     tags: [Tipos de Infracción]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo, descripcion, montoBase]
 *             properties:
 *               codigo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               montoBase:
 *                 type: number
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tipo de infracción creado
 */
router.post(
  '/',
  auth,
  roleGuard('administrativo'),
  validate(tipoInfraccionSchema),
  crearTipoInfraccion
);

/**
 * @swagger
 * /tipos-infraccion/{id}:
 *   put:
 *     summary: Actualizar tipo de infracción
 *     tags: [Tipos de Infracción]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de infracción actualizado
 */
router.put(
  '/:id',
  auth,
  roleGuard('administrativo'),
  validate(tipoInfraccionSchema),
  actualizarTipoInfraccion
);

export default router;
