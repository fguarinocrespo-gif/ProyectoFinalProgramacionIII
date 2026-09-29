import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPago extends Document {
  actaId: Types.ObjectId;
  registradoPorId: Types.ObjectId;
  monto: number;
  medioPago: 'contado' | 'tarjeta';
  fechaPago: Date;
  comprobante: string;
  createdAt: Date;
}

const pagoSchema = new Schema<IPago>(
  {
    actaId: {
      type: Schema.Types.ObjectId,
      ref: 'ActaInfraccion',
      required: [true, 'El acta es obligatoria'],
    },
    registradoPorId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario que registra es obligatorio'],
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    medioPago: {
      type: String,
      enum: ['contado', 'tarjeta'],
      required: [true, 'El medio de pago es obligatorio'],
    },
    fechaPago: {
      type: Date,
      default: Date.now,
    },
    comprobante: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Pago = mongoose.model<IPago>('Pago', pagoSchema);
