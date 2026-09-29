import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { Usuario } from '../../src/models/usuario.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

describe('Auth Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    const adminUser = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@test.com',
      password: 'password123',
      rol: 'administrativo',
    });
    
    adminToken = jwt.sign({ id: adminUser._id, email: adminUser.email, rol: adminUser.rol }, env.JWT_SECRET);
  });

  describe('POST /api/auth/login', () => {
    it('Debe iniciar sesión correctamente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.usuario).toHaveProperty('email', 'admin@test.com');
    });

    it('Debe rechazar credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
    });
  });

  describe('POST /api/auth/register', () => {
    it('Admin debe poder registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Inspector',
          apellido: 'Nuevo',
          email: 'inspector@test.com',
          password: 'password123',
          rol: 'inspector',
        });

      expect(res.status).toBe(201);
      expect(res.body.usuario).toHaveProperty('email', 'inspector@test.com');
    });

    it('Debe fallar si no hay token de admin', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Inspector',
          apellido: 'Nuevo',
          email: 'inspector@test.com',
          password: 'password123',
          rol: 'inspector',
        });

      expect(res.status).toBe(401);
    });
  });
});
