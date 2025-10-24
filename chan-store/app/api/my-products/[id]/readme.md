## Route.ts
CRUD parcial (GET, PATCH, DELETE)
- Autenticación: getUserId(): Retorna el id del usuario dentro del payload (id, _id o sub).
- Get: Consulta un producto del usuario autenticado.
  - getUserId() — valida sesión; si no hay usuario → 401 Unauthorized.
  - Product.findOne({ _id: params.id, userId }) — busca el producto por id-
  - Si no existe → 404 Not Found.
  - Si existe → retorna el documento en JSON.
- Patch: Actualiza parcialmente un producto del usuario.
  - Lee y normaliza el body (req.json()) : name, description, price, stock, etc.
  - Valida que el name no esté vacío → 400 “El nombre es obligatorio”.
  - findOneAndUpdate({ _id, userId }, { $set: update }, { new: true }) → actualiza y devuelve el producto actualizado.
  - Si no existe → 404 Not Found.
  - Éxito → 200 { ok: true, data: doc }.
- Delete: Elimina un producto del usuario autenticado.
  - Conecta y verifica usuario.
  - Product.deleteOne({ _id: params.id, userId }) — garantiza que sólo borre productos propios.
  - Éxito → 200 { ok: true }.
