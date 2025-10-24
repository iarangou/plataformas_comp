// lib/jwt.js
import jwt from 'jsonwebtoken';

// Prioriza JWT_SECRET y deja AUTH_SECRET como respaldo
const SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET;

if (!SECRET) {
  throw new Error('JWT secret is not set. Define JWT_SECRET (o AUTH_SECRET) en el .env');
}

export function signSession(payload, opts = {}) {
  // exp por defecto: 7 días
  const { expiresIn = '7d' } = opts;
  return jwt.sign(payload, SECRET, { expiresIn, algorithm: 'HS256' });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
  } catch {
    return null;
  }
}
