## route.js
Implementa el endpoint POST /api/auth/forgot-password que genera un enlace temporal para restablecer la contraseña de un usuario.
No revela si el correo existe o no (seguridad), y envía el link al correo registrado.

- Conexión
  - await connectDB() abre Mongo.
  - Lee { email } del body (await req.json()), normaliza (trim().toLowerCase()) y valida requerido → 400 (EMAIL_REQUIRED).

- Búsqueda del usuario
  - Hace User.findOne({ email }).select('_id email').lean() para obtener un POJO liviano.
  - Si no existe, responde genéricamente { ok: true, message: 'Si el correo existe...' } para no revelar existencia del usuario.

- Generación del token
  - generateResetToken() crea string aleatorio; sha256(token) guarda solo el hash por seguridad.
  - Calcula expiración a 15 min → new Date(Date.now() + 1000*60*15).

- Actualización del usuario
  - User.updateOne({ _id }, { $set: { resetPasswordTokenHash, resetPasswordExpires } }, { runValidators: false })

- Construcción del enlace
  - URL base (backend) + query param
  - Genera resetUrl = ${baseUrl}/reset/${token} (token en URL codificada).

- Envío del correo
  - sendResetPasswordEmail({ to: user.email, url: resetUrl }) usa helper de lib/email.js.
  - El correo contiene el enlace válido 15 min.

- Respuesta
  Devuelve siempre { ok: true, message: 'Si el correo existe, se envió un enlace', requestId }.

- Errores
  - Cualquier excepción se loguea con [FORGOT ERROR] (nombre, código, mensaje, stack, etc.).
  - Respuesta: 500 (FORGOT_INTERNAL_ERROR) → "Error generando enlace".
