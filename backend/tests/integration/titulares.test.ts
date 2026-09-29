import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { Usuario } from '../../src/models/usuario.model';
import { Titular } from '../../src/models/titular.model';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

describe('Titulares Routes', () => {
  let adminToken: string;
  let inspectorToken: string;
  let titularId: string;

  beforeEach(async () => {
    const adminUser = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@test.com',
      password: 'password123',
      rol: 'administrativo',
    });
    
    adminToken = jwt.sign({ id: adminUser._id, email: adminUser.email, rol: adminUser.rol }, env.JWT_SECRET);

    const inspectorUser = await Usuario.create({
      nombre: 'Inspector',
      apellido: 'Test',
      email: 'inspector@test.com',
      password: 'password123',
      rol: 'inspector',
    });
    
    inspectorToken = jwt.sign({ id: inspectorUser._id, email: inspectorUser.email, rol: inspectorUser.rol }, env.JWT_SECRET);

    const titular = await Titular.create({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      domicilio: 'Calle Falsa 123',
    });
    titularId = titular._id as string;
  });

  describe('GET /api/titulares', () => {
    it('Debe retornar la lista de titulares para un inspector', async () => {
      const res = await request(app)
        .get('/api/titulares')
        .set('Authorization', `Bearer ${inspectorToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('dni', '12345678');
    });
  });

  describe('POST /api/titulares', () => {
    it('Admin debe poder crear un titular', async () => {
      const res = await request(app)
        .post('/api/titulares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          dni: '87654321',
          nombre: 'Maria',
          apellido: 'Gomez',
          domicilio: 'Avenida Siempreviva 742',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('dni', '87654321');
    });

    it('Inspector no debe poder crear un titular', async () => {
      const res = await request(app)
        .post('/api/titulares')
        .set('Authorization', `Bearer ${inspectorToken}`)
        .send({
          dni: '11223344',
          nombre: 'Pedro',
          apellido: 'Pascal',
          domicilio: 'Hollywood',
        });

      expect(res.status).toBe(403);
    });
  });
});
