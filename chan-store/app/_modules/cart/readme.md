## Cart.types.ts
- CartItem: Representa un producto dentro del carrito. Tiene identificador (_id), nombre, precio, cantidad (qty), y opcionalmente una imagen.
- AddToCartInput: Define el tipo de entrada para agregar un producto al carrito.
- CartActions: Agrupa las acciones que manipulan el estado del carrito:
    add: agrega un nuevo producto.
    inc/dec: incrementa o decrementa cantidad.
    clear: vacía todo el carrito.
    open/close: controla el panel del carrito
- CartSelectors: Define los valores derivados del estado del carrito:
    items: lista de productos.
    open: si el panel está visible.
    count: número total de ítems.
    total: valor monetario total.

## cart.module.css
  - root : Paleta de colores
  - Overlay: Cubre el fondo cuando el carrito está abierto.
  - Drawer: Panel lateral derecho con animación de entrada.
  - Top: Encabezado del carrito con ícono y contador de ítems.
  - Body: Contiene los ítems o el mensaje de carrito vacío.
  - Item: Diseño en grid para miniatura y datos del producto.
  - Cantidad: Controles de suma/resta bien espaciados y legibles.
  - precio: Línea de subtotal.
  - Footer: Contiene el total y botón de checkout
 
## CartDrawer.tsx
  - CartDrawerProps: controlar el estado y las acciones del carrito.
  - Renderizado (overlay, drawer derecho(top, body, footer))

## CartProvider.tsx
- Imports: hooks de React y tipos (forma de los datos del carrito)
- Tipos de datos:
  - State: Estado global del carrito
  - Action: Conjunto de acciones que modifican el estado
- Reducer: Función pura que gestiona los cambios del carrito según la acción recibida(open, close, clear, hydrate(carga los itms guardados en localstorage), add, inc, dec)
- Contextos:
  - CartStateCtx: Contiene los selectores (estado del carrito).
  - CartActionsCtx: Contiene las acciones (funciones para modificar el estado).
  - useCart() y useCartActions(): Hooks personalizados para acceder al estado o acciones desde cualquier componente hijo.
#### CartProvider:
- Hydrate: Al montar el componente, intenta leer los ítems guardados en localStorage y restaurarlos al estado global.
- Persistir en localStorage
- UseMemo(Selectores: CartSelectors): calculos dinamicos (count, total, open(estado visibilidad del carrito))
- UseMemo(Acciones: CartActions): para las funciones add, inc, clear, open, close etc.
- return: Provee el estado (selectors) y las acciones (actions) al árbol de components asi pueden leerlo.
