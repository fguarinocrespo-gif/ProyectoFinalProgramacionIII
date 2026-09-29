import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';

// Rutas
import authRoutes from './routes/auth.routes';
import titularesRoutes from './routes/titulares.routes';
import vehiculosRoutes from './routes/vehiculos.routes';
import tiposInfraccionRoutes from './routes/tiposInfraccion.routes';
import actasRoutes from './routes/actas.routes';
import pagosRoutes from './routes/pagos.routes';
import descargosRoutes from './routes/descargos.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/titulares', titularesRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/tipos-infraccion', tiposInfraccionRoutes);
app.use('/api/actas', actasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/descargos', descargosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
