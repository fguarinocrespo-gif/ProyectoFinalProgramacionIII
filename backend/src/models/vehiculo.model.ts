import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVehiculo extends Document {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  titularId: Types.ObjectId;
  createdAt: Date;
}

const vehiculoSchema = new Schema<IVehiculo>(
  {
    patente: {
      type: String,
      required: [true, 'La patente es obligatoria'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true,
    },
    modelo: {
      type: String,
      required: [true, 'El modelo es obligatorio'],
      trim: true,
    },
    anio: {
      type: Number,
      required: [true, 'El año es obligatorio'],
    },
    titularId: {
      type: Schema.Types.ObjectId,
      ref: 'Titular',
      required: [true, 'El titular es obligatorio'],
    },
  },
  {
    timestamps: true,
  }
);

export const Vehiculo = mongoose.model<IVehiculo>('Vehiculo', vehiculoSchema);
