## AppChrome.tsx
- Imports: hooks de React y Next.js, componentes visuales de la interfaz, hook personalizado para bloquear el scroll cuando un panel está abierto, contexto global del carrito.
#### InnerChrome
Estructura principal de la app con header, sidebar y carrito activo.
- Estados:
  - openLeft: controla si el menú lateral izquierdo está abierto.
  - useCart(): obtiene los ítems, el contador y el estado open del carrito.
  - useCartActions(): expone acciones del carrito (open, close, inc, dec).
  - usePathname(): obtiene la ruta actual
- Variables:
  - isProfile: detecta si la página actual es /profile.
  - isFavorites: detecta si es /favorites.
  - useBodyScrollLock: bloquea el scroll cuando el menú o el carrito están visibles.
- Renderizado

#### AppChrome
Define qué partes del chrome deben mostrarse según la ruta.
- pathname: ruta actual
- hideChrome: regular rutas de autenticación(si coincide renderiza solo el contenido)
- CartProvider: envuelve InnerChrome para que cualquier componente dentro acceda al estado global del carrito.

## Header.tsx
- cartCount?: número de productos en el carrito (por defecto 0).
- onOpenMenu?: función que se ejecuta al presionar el botón del menú.
- onOpenCart?: función que se ejecuta al presionar el botón del carrito.
- title?: texto opcional; si está definido, el header muestra un título centrado (como en la vista de perfil o favoritos).
- showSearch?: por defecto true; oculta o muestra la barra de búsqueda.

#### Visualizacion:
- Izquierda: botón de menú (iconBtn + burger), abre el panel lateral.
- Centro:
    Si hay title, muestra el título centrado.
    Si no, muestra el logo y, si showSearch es true, la barra de búsqueda.
- Derecha: botón del carrito (cartBtn), muestra el icono y un badge si cartCount > 0, ejecuta onOpenCart al clic.

## LeftSidebar.tsx
Define el menú lateral izquierdo
- open: controla si el panel lateral está visible.
- onClose: función que cierra el panel (al hacer clic fuera o en una opción).
- onNavigate?: callback opcional al seleccionar una sección.
- userName?: nombre mostrado en el encabezado (por defecto "User").
- userAvatar?: imagen del usuario (por defecto /avatar-placeholder.png).

- useRouter(): permite cambiar de página
- items: lista de secciones disponibles (Inicio, Perfil, Pedidos, etc)
- routes: mapea las claves de items con sus rutas
- handle(key): Llama a onNavigate si existe, Redirige a la ruta asociada usando router.push, Cierra el panel (onClose()).
- handleLogout(): ierra el panel y redirige a /login

#### Visualizacion
- Overlay
- Drawer(top, lista, footer)
  
