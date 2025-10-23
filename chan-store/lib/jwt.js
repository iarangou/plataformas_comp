import jwt from 'jsonwebtoken';

const SECRET = process.env.AUTH_SECRET;

export function signSession(payload, opts = {}) {
  // exp por defecto: 7 días
  const { expiresIn = '7d' } = opts;
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

