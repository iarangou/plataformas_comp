import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '../../../../lib/email.js';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // manda a tu propio correo para probar que el SMTP funciona
    await sendResetPasswordEmail(process.env.SMTP_USER, 'http://localhost:3000/reset/TEST');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('SMTP TEST ERROR', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
