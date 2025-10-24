// lib/auth.js
// Contiene utilidades de autenticación: generación de tokens de reseteo y JWT.

import 'server-only';               // evita que se empaquete en cliente
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/* -------------------------------------------------------------------------- */
/*                           TOKEN DE RECUPERACIÓN                            */
/* -------------------------------------------------------------------------- */

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/* -------------------------------------------------------------------------- */
/*                                 JWT (Login)                                */
/* -------------------------------------------------------------------------- */

const SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET;

function assertSecret() {
  if (!SECRET) {
    throw new Error('JWT_SECRET (o AUTH_SECRET) no configurado en .env.local');
  }
}

/**
 * Firma un JWT con el payload { id, email } y expiración de 7 días por defecto.
 * Fija algoritmo HS256 explícitamente.
 */
export function signJWT(payload, options = {}) {
  assertSecret();
  const opts = { expiresIn: '7d', algorithm: 'HS256', ...options };
  return jwt.sign(payload, SECRET, opts);
}

/**
 * Verifica un JWT y retorna el payload decodificado.
 * Lanza error si el token es inválido o expiró.
 * Restringe a algoritmo HS256.
 */
export function verifyJWT(token) {
  assertSecret();
  if (!token || typeof token !== 'string') {
    throw new Error('Token ausente o inválido');
  }
  const decoded = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
  if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.email) {
    throw new Error('Estructura del token inválida');
  }
  return decoded; // { id, email, iat, exp }
}

/**
 * Extrae el token desde la cookie "token" en una petición (para endpoints).
 */
export function getTokenFromRequest(req) {
  const cookieHeader =
    (typeof req?.headers?.get === 'function' ? req.headers.get('cookie') : null) ||
    req?.headers?.cookie ||
    '';
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
