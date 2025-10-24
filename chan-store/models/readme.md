## products.js
- name: requerido sin espacios extra.
- price: requerido, Precio base del producto.
- category: requerido, categoría o tipo (ej. “tecnología”, “hogar”).
- rating: opcional, valor entre 0–5, inicia en 0.
- sales: opcional, contador de ventas, inicia en 0.
- image: opcional, URL o ruta de imagen, vacío por defecto.
- timestamps: agrega createdAt y updatedAt automáticamente.
- exportación segura: usa mongoose.models.Product || mongoose.model('Product', ProductSchema) para evitar recompilación en Next.js.
## products.ts
- name: requerido (String).
- price: requerido (Number).
- image: opcional (String).
- category: requerido (String, con índice).
- isTopSale: opcional (Boolean, por defecto false).
- isSuggested: opcional (Boolean, por defecto false).
## user.js
- name: requerido, texto sin espacios extra (trim), entre 2 y 60 caracteres.
- email: requerido, único, convertido a minúsculas (lowercase) y sin espacios extra.
- passwordHash: requerido, hash seguro de la contraseña.
- resetPasswordTokenHash: opcional, almacena el hash del token temporal usado para restablecer la contraseña.
- resetPasswordExpires: opcional, fecha de expiración del token de recuperacion
