// lib/email.js
import nodemailer from 'nodemailer';

const PORT = Number(process.env.SMTP_PORT || '0');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: PORT,
  secure: PORT === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  logger: true,
  debug: true,
  family: 4,
});

export async function sendResetPasswordEmail({ to, url }) {
  if (!to || !to.trim()) {
    const err = new Error('Destinatario "to" vacío');
    err.code = 'EMAIL_TO_INVALID';
    err.statusCode = 400;
    throw err;
  }

  try {
    await transporter.verify();
  } catch (e) {
    const err = new Error('SMTP verify failed');
    err.code = e?.code || 'SMTP_VERIFY_FAILED';
    err.responseCode = e?.responseCode;
    err.command = e?.command;
    err.response = e?.response || e?.message;
    throw err;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,     // p.ej. "ChanStore <no-reply@tu-dominio.com>"
      to: to.trim(),                    // 👈 Asegura que no vaya undefined
      subject: 'Restablece tu contraseña',
      html: `
        <p>Hola,</p>
        <p>Haz clic en el enlace para restablecer tu contraseña (válido 15 min):</p>
        <p><a href="${url}">${url}</a></p>
        <p>Si no pediste este cambio, ignora este correo.</p>
      `,
      text: `Restablece tu contraseña (15 min): ${url}`,
    });
    return info;
  } catch (e) {
    const err = new Error('SMTP sendMail failed');
    err.code = e?.code || 'SMTP_SEND_FAILED';
    err.responseCode = e?.responseCode;
    err.command = e?.command;
    err.response = e?.response || e?.message;
    err.rejected = e?.rejected;
    throw err;
  }
}
