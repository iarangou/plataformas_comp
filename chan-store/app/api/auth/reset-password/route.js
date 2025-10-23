import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
import { sha256 } from '../../../../lib/auth.js';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'token y password son requeridos' }, { status: 400 });
    }

    const tokenHash = sha256(token);
    const now = new Date();

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: now }
    });

    if (!user) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al restablecer contraseña' }, { status: 500 });
  }
}

