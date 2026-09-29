import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

// Importar modelos
import { Usuario } from '../models/usuario.model';
import { Titular } from '../models/titular.model';
import { Vehiculo } from '../models/vehiculo.model';
import { TipoInfraccion } from '../models/tipoInfraccion.model';
import { ActaInfraccion } from '../models/actaInfraccion.model';
import { Pago } from '../models/pago.model';
import { Descargo } from '../models/descargo.model';

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar base de datos
    await Promise.all([
      Usuario.deleteMany({}),
      Titular.deleteMany({}),
      Vehiculo.deleteMany({}),
      TipoInfraccion.deleteMany({}),
      ActaInfraccion.deleteMany({}),
      Pago.deleteMany({}),
      Descargo.deleteMany({}),
    ]);
    console.log('🗑️  Base de datos limpiada');

    // ========== USUARIOS ==========
    const passwordHash = await bcrypt.genSalt(10);

    const usuarios = await Usuario.create([
      {
        nombre: 'Carlos',
        apellido: 'González',
        email: 'inspector@sistema.com',
        password: 'inspector123',
        rol: 'inspector',
        activo: true,
      },
      {
        nombre: 'María',
        apellido: 'López',
        email: 'admin@sistema.com',
        password: 'admin123',
        rol: 'administrativo',
        activo: true,
      },
      {
        nombre: 'Juan',
        apellido: 'Martínez',
        email: 'inspector2@sistema.com',
        password: 'inspector123',
        rol: 'inspector',
        activo: true,
      },
    ]);
    console.log(`👤 ${usuarios.length} usuarios creados`);

    const inspector = usuarios[0];
    const admin = usuarios[1];
    const inspector2 = usuarios[2];

    // ========== TITULARES ==========
    const titulares = await Titular.create([
      {
        dni: '30567890',
        nombre: 'Roberto',
        apellido: 'Fernández',
        domicilio: 'Av. Mitre 1520, Avellaneda',
        telefono: '011-4201-5678',
        email: 'rfernandez@email.com',
      },
      {
        dni: '28934521',
        nombre: 'Ana',
        apellido: 'Rodríguez',
        domicilio: 'Calle San Martín 450, Quilmes',
        telefono: '011-4253-9012',
        email: 'arodriguez@email.com',
      },
      {
        dni: '35678901',
        nombre: 'Diego',
        apellido: 'Ramírez',
        domicilio: 'Bv. Buenos Aires 780, Lanús',
        telefono: '011-4241-3456',
        email: 'dramirez@email.com',
      },
      {
        dni: '32145678',
        nombre: 'Lucía',
        apellido: 'Pérez',
        domicilio: 'Av. Hipólito Yrigoyen 3200, Lomas de Zamora',
        telefono: '011-4292-7890',
        email: 'lperez@email.com',
      },
      {
        dni: '27890123',
        nombre: 'Martín',
        apellido: 'Sosa',
        domicilio: 'Calle Belgrano 120, Banfield',
        telefono: '011-4242-1234',
        email: 'msosa@email.com',
      },
      {
        dni: '33456789',
        nombre: 'Valentina',
        apellido: 'Castro',
        domicilio: 'Av. Calchaquí 1890, Florencio Varela',
        telefono: '011-4275-5678',
        email: 'vcastro@email.com',
      },
      {
        dni: '29012345',
        nombre: 'Sebastián',
        apellido: 'Morales',
        domicilio: 'Calle Rivadavia 650, Berazategui',
        telefono: '011-4256-9012',
        email: 'smorales@email.com',
      },
    ]);
    console.log(`📋 ${titulares.length} titulares creados`);

    // ========== VEHÍCULOS ==========
    const vehiculos = await Vehiculo.create([
      { patente: 'ABC123', marca: 'Ford', modelo: 'Focus', anio: 2018, titularId: titulares[0]._id },
      { patente: 'DEF456', marca: 'Volkswagen', modelo: 'Gol', anio: 2020, titularId: titulares[0]._id },
      { patente: 'GHI789', marca: 'Chevrolet', modelo: 'Cruze', anio: 2019, titularId: titulares[1]._id },
      { patente: 'AD123BC', marca: 'Toyota', modelo: 'Corolla', anio: 2022, titularId: titulares[2]._id },
      { patente: 'AE456FG', marca: 'Fiat', modelo: 'Cronos', anio: 2021, titularId: titulares[3]._id },
      { patente: 'JKL012', marca: 'Renault', modelo: 'Sandero', anio: 2017, titularId: titulares[4]._id },
      { patente: 'AF789HI', marca: 'Peugeot', modelo: '208', anio: 2023, titularId: titulares[5]._id },
      { patente: 'MNO345', marca: 'Honda', modelo: 'Civic', anio: 2020, titularId: titulares[6]._id },
    ]);
    console.log(`🚗 ${vehiculos.length} vehículos creados`);

    // ========== TIPOS DE INFRACCIÓN ==========
    const tiposInfraccion = await TipoInfraccion.create([
      { codigo: 'INF-001', descripcion: 'Estacionamiento en lugar prohibido', montoBase: 15000 },
      { codigo: 'INF-002', descripcion: 'Exceso de velocidad', montoBase: 35000 },
      { codigo: 'INF-003', descripcion: 'Cruce de semáforo en rojo', montoBase: 50000 },
      { codigo: 'INF-004', descripcion: 'Falta de seguro obligatorio', montoBase: 45000 },
      { codigo: 'INF-005', descripcion: 'Conducir con licencia vencida', montoBase: 30000 },
      { codigo: 'INF-006', descripcion: 'No respetar la senda peatonal', montoBase: 25000 },
      { codigo: 'INF-007', descripcion: 'Doble fila', montoBase: 20000 },
      { codigo: 'INF-008', descripcion: 'Giro indebido', montoBase: 18000 },
    ]);
    console.log(`⚠️  ${tiposInfraccion.length} tipos de infracción creados`);

    // ========== ACTAS DE INFRACCIÓN ==========
    const actas = await ActaInfraccion.create([
      {
        vehiculoId: vehiculos[0]._id,
        tipoInfraccionId: tiposInfraccion[0]._id,
        inspectorId: inspector._id,
        lugar: 'Av. Mitre y Calle 12, Avellaneda',
        fechaHora: new Date('2026-08-15T10:30:00'),
        monto: tiposInfraccion[0].montoBase,
        estado: 'pendiente',
        observaciones: 'Vehículo estacionado sobre la vereda',
      },
      {
        vehiculoId: vehiculos[2]._id,
        tipoInfraccionId: tiposInfraccion[1]._id,
        inspectorId: inspector._id,
        lugar: 'Ruta 210 Km 25, Quilmes',
        fechaHora: new Date('2026-08-20T14:15:00'),
        monto: tiposInfraccion[1].montoBase,
        estado: 'notificada',
        observaciones: 'Velocidad registrada: 95 km/h en zona de 60 km/h',
      },
      {
        vehiculoId: vehiculos[3]._id,
        tipoInfraccionId: tiposInfraccion[2]._id,
        inspectorId: inspector2._id,
        lugar: 'Av. Calchaquí y Av. San Martín, Lanús',
        fechaHora: new Date('2026-09-01T08:45:00'),
        monto: tiposInfraccion[2].montoBase,
        estado: 'pagada',
        observaciones: '',
      },
      {
        vehiculoId: vehiculos[1]._id,
        tipoInfraccionId: tiposInfraccion[3]._id,
        inspectorId: inspector._id,
        lugar: 'Calle Belgrano 500, Avellaneda',
        fechaHora: new Date('2026-09-05T11:00:00'),
        monto: tiposInfraccion[3].montoBase,
        estado: 'en_descargo',
        observaciones: 'Se verificó falta de póliza vigente',
      },
      {
        vehiculoId: vehiculos[4]._id,
        tipoInfraccionId: tiposInfraccion[4]._id,
        inspectorId: inspector2._id,
        lugar: 'Av. H. Yrigoyen 2800, Lomas de Zamora',
        fechaHora: new Date('2026-09-10T16:30:00'),
        monto: tiposInfraccion[4].montoBase,
        estado: 'pendiente',
        observaciones: 'Licencia vencida hace 3 meses',
      },
      {
        vehiculoId: vehiculos[5]._id,
        tipoInfraccionId: tiposInfraccion[5]._id,
        inspectorId: inspector._id,
        lugar: 'Calle Alsina y Av. Mitre, Banfield',
        fechaHora: new Date('2026-09-12T09:20:00'),
        monto: tiposInfraccion[5].montoBase,
        estado: 'anulada',
        observaciones: 'Peatón cruzando por la senda',
      },
      {
        vehiculoId: vehiculos[6]._id,
        tipoInfraccionId: tiposInfraccion[6]._id,
        inspectorId: inspector2._id,
        lugar: 'Av. Rivadavia 1200, Florencio Varela',
        fechaHora: new Date('2026-09-15T13:10:00'),
        monto: tiposInfraccion[6].montoBase,
        estado: 'notificada',
      },
      {
        vehiculoId: vehiculos[0]._id,
        tipoInfraccionId: tiposInfraccion[1]._id,
        inspectorId: inspector._id,
        lugar: 'Autopista Buenos Aires - La Plata, Km 10',
        fechaHora: new Date('2026-09-18T17:45:00'),
        monto: tiposInfraccion[1].montoBase,
        estado: 'pendiente',
        observaciones: 'Velocidad registrada: 140 km/h en zona de 130 km/h',
      },
      {
        vehiculoId: vehiculos[7]._id,
        tipoInfraccionId: tiposInfraccion[7]._id,
        inspectorId: inspector._id,
        lugar: 'Av. Calchaquí y Calle 14, Berazategui',
        fechaHora: new Date('2026-09-20T10:05:00'),
        monto: tiposInfraccion[7].montoBase,
        estado: 'pagada',
      },
      {
        vehiculoId: vehiculos[2]._id,
        tipoInfraccionId: tiposInfraccion[0]._id,
        inspectorId: inspector2._id,
        lugar: 'Calle Lavalle 300, Quilmes',
        fechaHora: new Date('2026-09-22T15:30:00'),
        monto: tiposInfraccion[0].montoBase,
        estado: 'pendiente',
      },
      {
        vehiculoId: vehiculos[3]._id,
        tipoInfraccionId: tiposInfraccion[5]._id,
        inspectorId: inspector._id,
        lugar: 'Av. 9 de Julio y Av. Eva Perón, Lanús',
        fechaHora: new Date('2026-09-25T08:00:00'),
        monto: tiposInfraccion[5].montoBase,
        estado: 'notificada',
      },
      {
        vehiculoId: vehiculos[4]._id,
        tipoInfraccionId: tiposInfraccion[6]._id,
        inspectorId: inspector2._id,
        lugar: 'Calle Almirante Brown 800, Lomas de Zamora',
        fechaHora: new Date('2026-09-27T12:40:00'),
        monto: tiposInfraccion[6].montoBase,
        estado: 'pendiente',
      },
    ]);
    console.log(`📝 ${actas.length} actas de infracción creadas`);

    // ========== PAGOS ==========
    const pagos = await Pago.create([
      {
        actaId: actas[2]._id, // Acta pagada (semáforo en rojo)
        registradoPorId: admin._id,
        monto: actas[2].monto,
        medioPago: 'tarjeta',
        fechaPago: new Date('2026-09-03T10:00:00'),
        comprobante: 'COMP-001',
      },
      {
        actaId: actas[8]._id, // Acta pagada (giro indebido)
        registradoPorId: admin._id,
        monto: actas[8].monto,
        medioPago: 'contado',
        fechaPago: new Date('2026-09-21T14:30:00'),
        comprobante: 'COMP-002',
      },
    ]);
    console.log(`💰 ${pagos.length} pagos registrados`);

    // ========== DESCARGOS ==========
    const descargos = await Descargo.create([
      {
        actaId: actas[3]._id, // Acta en descargo (falta de seguro)
        registradoPorId: admin._id,
        motivo: 'El titular presenta póliza vigente que estaba en trámite de renovación al momento de la infracción',
        documentacionAdjunta: 'poliza_renovacion.pdf',
        estado: 'presentado',
        fechaPresentacion: new Date('2026-09-07T09:00:00'),
      },
      {
        actaId: actas[5]._id, // Acta anulada (senda peatonal)
        registradoPorId: admin._id,
        motivo: 'Se presenta video de cámara de seguridad que muestra que el conductor respetó la senda peatonal',
        documentacionAdjunta: 'video_camara.mp4',
        estado: 'aceptado',
        fechaPresentacion: new Date('2026-09-14T11:00:00'),
      },
    ]);
    console.log(`📄 ${descargos.length} descargos registrados`);

    console.log('\n✅ Seed completado exitosamente');
    console.log('\n📧 Credenciales de acceso:');
    console.log('   Inspector:      inspector@sistema.com / inspector123');
    console.log('   Administrativo: admin@sistema.com / admin123');
    console.log('   Inspector 2:    inspector2@sistema.com / inspector123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
