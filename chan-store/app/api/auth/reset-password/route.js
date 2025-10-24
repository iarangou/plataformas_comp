// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
import { sha256 } from '../../../../lib/auth.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req) {
  const requestId = crypto.randomBytes(6).toString('hex');
  try {
    await connectDB();

    const { token, password, confirmPassword } = await req.json();

    if (!token) {
      return NextResponse.json(
        { ok: false, code: 'TOKEN_REQUIRED', message: 'Token requerido', requestId },
        { status: 400 }
      );
    }
    if (!password || password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, code: 'PASSWORD_MISMATCH', message: 'Las contraseñas no coinciden', requestId },
        { status: 400 }
      );
    }

    const tokenHash = sha256(token);

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    })
      .select('_id email')
      .lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, code: 'TOKEN_INVALID', message: 'Token inválido o expirado', requestId },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // Escribimos en passwordHash (lo que usa tu login) y también en password por compatibilidad.
    const update = {
      $set: {
        passwordHash: hashed,
        password: hashed,
      },
      $unset: {
        resetPasswordTokenHash: '',
        resetPasswordExpires: '',
      },
    };

    const result = await User.updateOne(
      { _id: user._id },
      update,
      {
        runValidators: false, // evita "name is required"
        strict: false,        // permite campos no definidos en el schema
      }
    );

    if (!result?.acknowledged || result.matchedCount !== 1) {
      return NextResponse.json(
        { ok: false, code: 'USER_NOT_FOUND', message: 'Usuario no encontrado al actualizar', requestId },
        { status: 404 }
      );
    }

    // Relee el documento crudo y verifica que el hash quedó
    const check = await User.findById(user._id).lean();
    const storedHash = check?.passwordHash || check?.password || null;

    if (!storedHash) {
      return NextResponse.json(
        {
          ok: false,
          code: 'NO_PASSWORD_FIELD',
          message:
            'No se encontró un campo de contraseña persistido (passwordHash/password). Revisa el esquema o el modo estricto.',
          requestId,
        },
        { status: 500 }
      );
    }

    // Confirmamos que el hash guardado corresponde a la nueva contraseña
    const match = await bcrypt.compare(password, storedHash);
    if (!match) {
      return NextResponse.json(
        {
          ok: false,
          code: 'PASSWORD_NOT_PERSISTED',
          message:
            'La nueva contraseña no coincide con el hash guardado. Verifica el nombre del campo en el esquema/login.',
          requestId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: 'Contraseña actualizada exitosamente', requestId },
      { status: 200 }
    );
  } catch (e) {
    console.error('[RESET-PASSWORD ERROR]', {
      requestId,
      name: e?.name,
      code: e?.code,
      message: e?.message,
      stack: e?.stack,
    });

    return NextResponse.json(
      {
        ok: false,
        code: e?.code || 'RESET_INTERNAL_ERROR',
        message: 'Error al restablecer la contraseña',
        requestId,
      },
      { status: 500 }
    );
  }
}
