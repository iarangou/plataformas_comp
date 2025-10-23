// lib/auth.js
// Contiene utilidades de autenticación: generación de tokens de reseteo y JWT.

// Dependencias
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/* -------------------------------------------------------------------------- */
/*                           TOKEN DE RECUPERACIÓN                            */
/* -------------------------------------------------------------------------- */

/**
 * Genera un token aleatorio de 64 caracteres hexadecimales
 * usado para enlaces de recuperación de contraseña.
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Retorna el hash SHA-256 de una cadena (para guardar tokens en BD).
 */
export function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/* -------------------------------------------------------------------------- */
/*                                 JWT (Login)                                */
/* -------------------------------------------------------------------------- */

/**
 * Lanza error si JWT_SECRET no está configurado.
 */
function assertSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no configurado en .env.local');
  }
}

/**
 * Firma un JWT con el payload { id, email } y expiración de 7 días por defecto.
 */
export function signJWT(payload, options = {}) {
  assertSecret();
  const opts = { expiresIn: '7d', ...options };
  return jwt.sign(payload, process.env.JWT_SECRET, opts);
}

/**
 * Verifica un JWT y retorna el payload decodificado.
 * Lanza error si el token es inválido o expiró.
 */
export function verifyJWT(token) {
  assertSecret();
  if (!token || typeof token !== 'string') {
    throw new Error('Token ausente o inválido');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.email) {
    throw new Error('Estructura del token inválida');
  }
  return decoded; // { id, email, iat, exp }
}

/**
 * Extrae el token desde la cookie "token" en una petición (para endpoints).
 */
export function getTokenFromRequest(req) {
  const cookie = req.headers.get?.('cookie') || req.headers?.cookie || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
