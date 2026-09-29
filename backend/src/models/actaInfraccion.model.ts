import mongoose, { Schema, Document, Types } from 'mongoose';

export type EstadoActa = 'pendiente' | 'notificada' | 'pagada' | 'en_descargo' | 'anulada';

export interface IActaInfraccion extends Document {
  numeroActa: number;
  vehiculoId: Types.ObjectId;
  tipoInfraccionId: Types.ObjectId;
  inspectorId: Types.ObjectId;
  lugar: string;
  fechaHora: Date;
  monto: number;
  estado: EstadoActa;
  observaciones: string;
  createdAt: Date;
}

const actaInfraccionSchema = new Schema<IActaInfraccion>(
  {
    numeroActa: {
      type: Number,
      unique: true,
    },
    vehiculoId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehiculo',
      required: [true, 'El vehículo es obligatorio'],
    },
    tipoInfraccionId: {
      type: Schema.Types.ObjectId,
      ref: 'TipoInfraccion',
      required: [true, 'El tipo de infracción es obligatorio'],
    },
    inspectorId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El inspector es obligatorio'],
    },
    lugar: {
      type: String,
      required: [true, 'El lugar es obligatorio'],
      trim: true,
    },
    fechaHora: {
      type: Date,
      required: [true, 'La fecha y hora es obligatoria'],
      default: Date.now,
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'notificada', 'pagada', 'en_descargo', 'anulada'],
      default: 'pendiente',
    },
    observaciones: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-incrementar número de acta
actaInfraccionSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastActa = await mongoose
      .model('ActaInfraccion')
      .findOne()
      .sort({ numeroActa: -1 })
      .lean();
    this.numeroActa = lastActa ? (lastActa as any).numeroActa + 1 : 1;
  }
  next();
});

export const ActaInfraccion = mongoose.model<IActaInfraccion>(
  'ActaInfraccion',
  actaInfraccionSchema
);
