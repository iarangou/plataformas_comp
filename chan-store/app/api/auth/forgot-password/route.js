import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
import { generateResetToken, sha256 } from '../../../../lib/auth.js';
import { sendResetPasswordEmail } from '../../../../lib/email.js'; // 👈 IMPORTAR AQUÍ

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'email requerido' }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // respuesta genérica
      return NextResponse.json({ ok: true, message: 'Si el correo existe, se envió un enlace' });
    }

    const token = generateResetToken();
    const tokenHash = sha256(token);
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = expires;
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset/${token}`;

    // 👇 ENVÍO REAL
    await sendResetPasswordEmail(user.email, resetUrl);

    // respuesta genérica (si quieres ocultar resetUrl)
    return NextResponse.json({ ok: true, message: 'Si el correo existe, se envió un enlace' });
  } catch (e) {
    console.error('FORGOT ERROR', e);
    return NextResponse.json({ error: 'Error generando enlace' }, { status: 500 });
  }
}
