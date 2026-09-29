import { Router } from 'express';
import {
  listarTitulares,
  obtenerTitular,
  crearTitular,
  actualizarTitular,
  eliminarTitular,
  obtenerDeudaTitular,
} from '../controllers/titulares.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { titularSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /titulares:
 *   get:
 *     summary: Listar todos los titulares
 *     tags: [Titulares]
 *     responses:
 *       200:
 *         description: Lista de titulares
 */
router.get('/', auth, listarTitulares);

/**
 * @swagger
 * /titulares/{id}:
 *   get:
 *     summary: Obtener titular por ID
 *     tags: [Titulares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del titular
 *       404:
 *         description: Titular no encontrado
 */
router.get('/:id', auth, obtenerTitular);

/**
 * @swagger
 * /titulares/{id}/deuda:
 *   get:
 *     summary: Obtener deuda total del titular
 *     tags: [Titulares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información de deuda
 */
router.get('/:id/deuda', auth, obtenerDeudaTitular);

/**
 * @swagger
 * /titulares:
 *   post:
 *     summary: Crear nuevo titular
 *     tags: [Titulares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dni, nombre, apellido, domicilio]
 *             properties:
 *               dni:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               domicilio:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Titular creado
 */
router.post(
  '/',
  auth,
  roleGuard('administrativo'),
  validate(titularSchema),
  crearTitular
);

/**
 * @swagger
 * /titulares/{id}:
 *   put:
 *     summary: Actualizar titular
 *     tags: [Titulares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Titular actualizado
 */
router.put(
  '/:id',
  auth,
  roleGuard('administrativo'),
  validate(titularSchema),
  actualizarTitular
);

/**
 * @swagger
 * /titulares/{id}:
 *   delete:
 *     summary: Eliminar titular
 *     tags: [Titulares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Titular eliminado
 */
router.delete('/:id', auth, roleGuard('administrativo'), eliminarTitular);

export default router;
