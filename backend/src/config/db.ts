import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB conectado exitosamente');
  } catch (error) {
    logger.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};
