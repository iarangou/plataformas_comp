## Route.js
- Conexión
  Importa sendResetPasswordEmail desde lib/email.js, que gestiona el envío con el servicio SMTP
- Lectura y validación del body
  - await req.json(): Extrae destinatario y enlace del correo.
  - Si falta to → 400 { ok: false, code: "EMAIL_REQUIRED", message: 'Falta "to" o SMTP_USER' }.
- Envío de correo
  - sendResetPasswordEmail: ejecuta el envío real del correo de restablecimiento de contraseña.
  - Devuelve información del proveedor SMTP (messageId, accepted, rejected, envelope).
- Respuesta
  - Éxito → 200
  - Error → 500 (o código SMTP específico)
