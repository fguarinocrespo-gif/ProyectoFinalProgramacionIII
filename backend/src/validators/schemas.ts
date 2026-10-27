import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ error: 'El email es obligatorio' })
    .email('Email inválido'),
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z
    .string({ error: 'El apellido es obligatorio' })
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z
    .string({ error: 'El email es obligatorio' })
    .email('Email inválido'),
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['inspector', 'administrativo'], {
    error: 'Rol inválido, debe ser inspector o administrativo',
  }),
});

export const titularSchema = z.object({
  dni: z
    .string({ error: 'El DNI es obligatorio' })
    .min(7, 'El DNI debe tener al menos 7 caracteres')
    .max(8, 'El DNI no puede tener más de 8 caracteres'),
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z
    .string({ error: 'El apellido es obligatorio' })
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  domicilio: z
    .string({ error: 'El domicilio es obligatorio' })
    .min(3, 'El domicilio debe tener al menos 3 caracteres'),
  telefono: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        if (!/^[0-9\s\-()+]+$/.test(val)) return false;
        const digits = val.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15;
      },
      {
        message: 'Teléfono inválido. Debe contener entre 7 y 15 dígitos numéricos',
      }
    )
    .optional()
    .default(''),
  email: z.string().email('Email inválido').optional().or(z.literal('')).default(''),
});

export const vehiculoSchema = z.object({
  patente: z
    .string({ error: 'La patente es obligatoria' })
    .regex(/^([A-Za-z]{3}\d{3}|[A-Za-z]{2}\d{3}[A-Za-z]{2})$/, 'Formato inválido. Use AB123CD o ABC123'),
  marca: z
    .string({ error: 'La marca es obligatoria' })
    .min(2, 'La marca debe tener al menos 2 caracteres'),
  modelo: z
    .string({ error: 'El modelo es obligatorio' })
    .min(1, 'El modelo es obligatorio'),
  anio: z
    .number({ error: 'El año es obligatorio' })
    .int('El año debe ser un número entero')
    .min(1900, 'El año no puede ser menor a 1900')
    .max(new Date().getFullYear() + 1, 'El año no puede ser futuro'),
  titularId: z
    .string({ error: 'El titular es obligatorio' })
    .min(1, 'El titular es obligatorio'),
});

export const tipoInfraccionSchema = z.object({
  codigo: z
    .string({ error: 'El código es obligatorio' })
    .min(1, 'El código es obligatorio'),
  descripcion: z
    .string({ error: 'La descripción es obligatoria' })
    .min(5, 'La descripción debe tener al menos 5 caracteres'),
  montoBase: z
    .number({ error: 'El monto base es obligatorio' })
    .min(0, 'El monto no puede ser negativo'),
  activo: z.boolean().optional().default(true),
});

export const actaInfraccionSchema = z.object({
  vehiculoId: z
    .string({ error: 'El vehículo es obligatorio' })
    .min(1, 'El vehículo es obligatorio'),
  tipoInfraccionId: z
    .string({ error: 'El tipo de infracción es obligatorio' })
    .min(1, 'El tipo de infracción es obligatorio'),
  lugar: z
    .string({ error: 'El lugar es obligatorio' })
    .min(3, 'El lugar debe tener al menos 3 caracteres'),
  fechaHora: z.string().or(z.date()).optional(),
  observaciones: z.string().optional().default(''),
});

export const cambioEstadoActaSchema = z.object({
  estado: z.enum(['pendiente', 'notificada', 'pagada', 'en_descargo', 'anulada'], {
    error: 'Estado inválido',
  }),
});

export const pagoSchema = z.object({
  actaId: z
    .string({ error: 'El acta es obligatoria' })
    .min(1, 'El acta es obligatoria'),
  monto: z
    .number({ error: 'El monto es obligatorio' })
    .min(0, 'El monto no puede ser negativo'),
  medioPago: z.enum(['contado', 'tarjeta'], {
    error: 'Medio de pago inválido, debe ser contado o tarjeta',
  }),
  comprobante: z.string().optional().default(''),
});

export const descargoSchema = z.object({
  actaId: z
    .string({ error: 'El acta es obligatoria' })
    .min(1, 'El acta es obligatoria'),
  motivo: z
    .string({ error: 'El motivo es obligatorio' })
    .min(10, 'El motivo debe tener al menos 10 caracteres'),
  documentacionAdjunta: z.string().optional().default(''),
});

export const cambioEstadoDescargoSchema = z.object({
  estado: z.enum(['aceptado', 'rechazado'], {
    error: 'Estado inválido, debe ser aceptado o rechazado',
  }),
});
