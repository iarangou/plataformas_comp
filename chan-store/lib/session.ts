// lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { signJWT, verifyJWT } from './auth';

const COOKIE_NAME = 'token';
const ONE_WEEK = 60 * 60 * 24 * 7;

function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Crea la sesión: firma un JWT { id, email } y lo guarda en cookie httpOnly.
 * Llama esto después de un login exitoso o registro.
 */
export async function createSession(user: { id: string; email: string }) {
  const token = signJWT({ id: user.id, email: user.email }, { expiresIn: '7d' });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  });

  return token;
}

/**
 * Obtiene la sesión actual desde la cookie. Devuelve { id, email } o null.
 * Úsalo en endpoints/server actions/pages protegidas.
 */
export async function getSession() {
  const c = (await cookies()).get(COOKIE_NAME)?.value;
  if (!c) return null;

  try {
    const decoded = verifyJWT(c) as { id: string; email: string; iat: number; exp: number };
    return { id: decoded.id, email: decoded.email, iat: decoded.iat, exp: decoded.exp };
  } catch {
    return null;
  }
}

/**
 * Elimina la sesión actual (logout).
 */
export async function destroySession() {
  (await cookies()).set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Helper opcional: asegura sesión en un endpoint.
 * Lánzalo al inicio de rutas que necesitan auth.
 */
export function requireSession() {
  const session = getSession();
  if (!session) {
    const err = new Error('Unauthorized');
    // @ts-ignore
    err.status = 401;
    throw err;
  }
  return session;
}
