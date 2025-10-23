// lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                 // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),         // 465
  secure: Number(process.env.SMTP_PORT) === 465, // true si 465
  auth: {
    user: process.env.SMTP_USER,               // tu gmail
    pass: process.env.SMTP_PASS                // app password (sin espacios)
  }
});

export async function sendResetPasswordEmail(toEmail, resetUrl) {
  // opcional: comprobar conexión
  await transporter.verify();

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,              // "ChanStore <tu_gmail>"
    to: toEmail,
    subject: 'Restablece tu contraseña',
    html: `
      <p>Hola,</p>
      <p>Haz clic en el enlace para restablecer tu contraseña (válido 15 min):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Si no pediste este cambio, ignora este correo.</p>
    `,
    text: `Restablece tu contraseña: ${resetUrl}`
  });

  console.log('Mail sent:', info.messageId);
  return info;
}
