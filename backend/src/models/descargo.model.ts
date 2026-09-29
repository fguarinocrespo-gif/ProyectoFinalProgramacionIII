import mongoose, { Schema, Document, Types } from 'mongoose';

export type EstadoDescargo = 'presentado' | 'aceptado' | 'rechazado';

export interface IDescargo extends Document {
  actaId: Types.ObjectId;
  registradoPorId: Types.ObjectId;
  motivo: string;
  documentacionAdjunta: string;
  estado: EstadoDescargo;
  fechaPresentacion: Date;
  createdAt: Date;
}

const descargoSchema = new Schema<IDescargo>(
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
    motivo: {
      type: String,
      required: [true, 'El motivo es obligatorio'],
      trim: true,
    },
    documentacionAdjunta: {
      type: String,
      trim: true,
      default: '',
    },
    estado: {
      type: String,
      enum: ['presentado', 'aceptado', 'rechazado'],
      default: 'presentado',
    },
    fechaPresentacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Descargo = mongoose.model<IDescargo>('Descargo', descargoSchema);
