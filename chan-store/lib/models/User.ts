import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },

    // ✅ Campos para recuperación de contraseña
    resetPasswordTokenHash: {
      type: String,
      index: true,     // se usa en el lookup por token
      select: false,   // no exponer al leer; sigue siendo escribible
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      index: true,     // se usa en la condición $gt: now
      default: undefined,
    },
  },
  { timestamps: true }
);

// Índice compuesto útil para la query { tokenHash, expires: { $gt: now } }
UserSchema.index({ resetPasswordTokenHash: 1, resetPasswordExpires: 1 });

export default models.User || model('User', UserSchema);
