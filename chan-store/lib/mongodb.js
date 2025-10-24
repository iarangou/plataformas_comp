// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'chanstore';

if (!MONGODB_URI) {
  throw new Error('Falta MONGODB_URI en .env.local');
}

// Cache global robusto (funciona en dev/HMR)
const g = globalThis;
if (!g._mongoose) {
  g._mongoose = { conn: null, promise: null };
}
let cached = g._mongoose;

export async function connectDB() {
  // Si ya hay conexión viva, retorna
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Puedes ajustar timeouts si lo necesitas
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      // serverSelectionTimeoutMS: 5000,
      // heartbeatFrequencyMS: 10000,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Alias opcional por consistencia con otros imports
export const connectToDB = connectDB;
