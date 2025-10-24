// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
import { generateResetToken, sha256 } from '../../../../lib/auth.js';
import { sendResetPasswordEmail } from '../../../../lib/email.js';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req) {
  const requestId = crypto.randomBytes(6).toString('hex');
  try {
    await connectDB();

    const { email } = await req.json();
    const safeEmail = (email || '').trim().toLowerCase();
    if (!safeEmail) {
      return NextResponse.json(
        { ok: false, code: 'EMAIL_REQUIRED', message: 'email requerido', requestId },
        { status: 400 }
      );
    }

    // Trae solo lo necesario (evita cargar campos faltantes que luego molestan)
    const user = await User.findOne({ email: safeEmail }).select('_id email').lean();
    // Respuesta genérica para no filtrar existencia
    if (!user) {
      return NextResponse.json(
        { ok: true, message: 'Si el correo existe, se envió un enlace', requestId }
      );
    }

    // Genera token + expira
    const token = generateResetToken();
    const tokenHash = sha256(token);
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    // ⚠️ IMPORTANTE: usar updateOne y desactivar validaciones del esquema
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordTokenHash: tokenHash,
          resetPasswordExpires: expires,
        },
      },
      { runValidators: false } // evita "User validation failed: name is required"
    );

    // URL base (backend) + query param
    const baseUrl =
      process.env.BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    const resetUrl = `${baseUrl}/reset/${encodeURIComponent(token)}`;

    // 👇 firma actualizada: objeto { to, url }
    await sendResetPasswordEmail({ to: user.email, url: resetUrl });

    return NextResponse.json(
      { ok: true, message: 'Si el correo existe, se envió un enlace', requestId }
    );
  } catch (e) {
    // Log detallado en servidor
    console.error('[FORGOT ERROR]', {
      requestId,
      name: e?.name,
      code: e?.code,
      message: e?.message,
      responseCode: e?.responseCode,
      response: e?.response,
      stack: e?.stack,
    });

    // Respuesta con código legible en cliente
    return NextResponse.json(
      {
        ok: false,
        code: e?.code || 'FORGOT_INTERNAL_ERROR',
        message: 'Error generando enlace',
        requestId,
      },
      { status: 500 }
    );
  }
}
