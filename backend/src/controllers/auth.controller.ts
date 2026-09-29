import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const generarToken = (id: string, email: string, rol: string): string => {
  return jwt.sign({ id, email, rol }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email, activo: true });
    if (!usuario) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = generarToken(
      usuario._id as string,
      usuario.email,
      usuario.rol
    );

    logger.info(`Usuario ${usuario.email} inició sesión`);

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    const existente = await Usuario.findOne({ email });
    if (existente) {
      res.status(409).json({ message: 'Ya existe un usuario con ese email' });
      return;
    }

    const usuario = await Usuario.create({ nombre, apellido, email, password, rol });

    logger.info(`Nuevo usuario registrado: ${usuario.email} (${usuario.rol})`);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuario = await Usuario.findById(req.usuario?.id).select('-password');
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};
