// app/api/_debug/sendmail/route.js
import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '../../../../lib/email.js';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = (body?.to || process.env.SMTP_USER || '').trim();
    const url = body?.url || 'http://localhost:3000/reset/TEST';

    if (!to) {
      return NextResponse.json(
        { ok: false, code: 'EMAIL_REQUIRED', message: 'Falta "to" o SMTP_USER' },
        { status: 400 }
      );
    }

    const info = await sendResetPasswordEmail({ to, url });

    return NextResponse.json({
      ok: true,
      messageId: info?.messageId || null,
      accepted: info?.accepted || [],
      rejected: info?.rejected || [],
      envelope: info?.envelope || null,
    });
  } catch (e) {
    // Normalizamos para ver bien desde Insomnia
    return NextResponse.json(
      {
        ok: false,
        code: e?.code || 'INTERNAL_ERROR',
        message: e?.message || 'Fallo enviando correo',
        // Muchos proveedores exponen cosas útiles aquí:
        smtp: {
          name: e?.name || null,
          command: e?.command || null,
          response: e?.response || null,
        },
      },
      { status: e?.statusCode || 500 }
    );
  }
}
