import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Servidor corriendo en http://localhost:${env.PORT}`);
    logger.info(`Documentación API: http://localhost:${env.PORT}/api/docs`);
  });
};

start().catch((error) => {
  logger.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
