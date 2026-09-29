import mongoose, { Schema, Document } from 'mongoose';

export interface ITipoInfraccion extends Document {
  codigo: string;
  descripcion: string;
  montoBase: number;
  activo: boolean;
  createdAt: Date;
}

const tipoInfraccionSchema = new Schema<ITipoInfraccion>(
  {
    codigo: {
      type: String,
      required: [true, 'El código es obligatorio'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    montoBase: {
      type: Number,
      required: [true, 'El monto base es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TipoInfraccion = mongoose.model<ITipoInfraccion>(
  'TipoInfraccion',
  tipoInfraccionSchema
);
