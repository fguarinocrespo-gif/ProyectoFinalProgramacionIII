import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'inspector' | 'administrativo';
  activo: boolean;
  createdAt: Date;
  compararPassword(password: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>(
  {
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
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    rol: {
      type: String,
      enum: ['inspector', 'administrativo'],
      required: [true, 'El rol es obligatorio'],
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

// Hash de password antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
usuarioSchema.methods.compararPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// No devolver password en las queries
usuarioSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);
