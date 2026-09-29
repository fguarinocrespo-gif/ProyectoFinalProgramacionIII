import { Router } from 'express';
import { obtenerResumen } from '../controllers/dashboard.controller';
import { auth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

/**
 * @swagger
 * /dashboard/resumen:
 *   get:
 *     summary: Obtener resumen del dashboard (actas por estado + recaudación)
 *     tags: [Dashboard]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Resumen del dashboard
 */
router.get('/resumen', auth, roleGuard('administrativo'), obtenerResumen);

export default router;
