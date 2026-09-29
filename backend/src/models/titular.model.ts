import mongoose, { Schema, Document } from 'mongoose';

export interface ITitular extends Document {
  dni: string;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
  email: string;
  createdAt: Date;
}

const titularSchema = new Schema<ITitular>(
  {
    dni: {
      type: String,
      required: [true, 'El DNI es obligatorio'],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
    },
    domicilio: {
      type: String,
      required: [true, 'El domicilio es obligatorio'],
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Titular = mongoose.model<ITitular>('Titular', titularSchema);
