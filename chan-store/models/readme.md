## products.js
- name: requerido sin espacios extra.
- price: requerido, Precio base del producto.
- category: requerido, categoría o tipo (ej. “tecnología”, “hogar”).
- rating: opcional, valor entre 0–5, inicia en 0.
- sales: opcional, contador de ventas, inicia en 0.
- image: opcional, URL o ruta de imagen, vacío por defecto.
- timestamps: agrega createdAt y updatedAt automáticamente.
- exportación segura: usa mongoose.models.Product || mongoose.model('Product', ProductSchema) para evitar recompilación en Next.js.
