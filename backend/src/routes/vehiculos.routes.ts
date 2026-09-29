import { Router } from 'express';
import {
  listarVehiculos,
  obtenerVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  obtenerDeudaVehiculo,
} from '../controllers/vehiculos.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import { vehiculoSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /vehiculos:
 *   get:
 *     summary: Listar todos los vehículos
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Lista de vehículos
 */
router.get('/', auth, listarVehiculos);

/**
 * @swagger
 * /vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del vehículo
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/:id', auth, obtenerVehiculo);

/**
 * @swagger
 * /vehiculos/{id}/deuda:
 *   get:
 *     summary: Obtener deuda total del vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información de deuda del vehículo
 */
router.get('/:id/deuda', auth, obtenerDeudaVehiculo);

/**
 * @swagger
 * /vehiculos:
 *   post:
 *     summary: Crear nuevo vehículo
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patente, marca, modelo, anio, titularId]
 *             properties:
 *               patente:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               anio:
 *                 type: number
 *               titularId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehículo creado
 */
router.post(
  '/',
  auth,
  roleGuard('administrativo'),
  validate(vehiculoSchema),
  crearVehiculo
);

/**
 * @swagger
 * /vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 */
router.put(
  '/:id',
  auth,
  roleGuard('administrativo'),
  validate(vehiculoSchema),
  actualizarVehiculo
);

/**
 * @swagger
 * /vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehículo eliminado
 */
router.delete('/:id', auth, roleGuard('administrativo'), eliminarVehiculo);

export default router;
