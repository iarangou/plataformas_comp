// lib/db.ts
import 'server-only';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error('⚠️ Define MONGODB_URI en .env.local');
}

// Tipado del cache global para evitar múltiples conexiones en dev/HMR
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Declara en global el cache si no existe
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };

export async function connectToDB() {
  // Si ya está conectada, retorna
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Opcional: ajusta opciones si lo necesitas (timeouts, etc.)
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
      // bufferCommands: false,            // opcional
      // serverSelectionTimeoutMS: 5000,  // opcional
    });
  }

  cached.conn = await cached.promise;

  // Guarda el cache en global para próximas importaciones
  global._mongoose = cached;

  return cached.conn;
}

// Alias común usado en otras partes del proyecto
export const connectDB = connectToDB;
