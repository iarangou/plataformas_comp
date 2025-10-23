import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
// CAMBIO 1 → usar signJWT desde lib/auth.js
import { signJWT } from '../../../../lib/auth.js';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // CAMBIO 2 → firmar JWT compatible con verifyJWT (usa id y email)
    const token = signJWT({ id: String(user._id), email: user.email });

    // CAMBIO 3 → cookie llamada 'token' en lugar de 'session'
    const res = NextResponse.json({ ok: true });
    res.headers.set(
      'Set-Cookie',
      [
        `token=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        process.env.NODE_ENV === 'production' ? 'Secure' : '',
        'Max-Age=604800', // 7 días
      ].filter(Boolean).join('; ')
    );

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error en inicio de sesión' }, { status: 500 });
  }
}
