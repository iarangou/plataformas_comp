## PriductCard.tsx
Componente de tarjeta individual de producto. Permite visualizar la información básica del producto y añadirlo al carrito.

- id: string → identificador único del producto.
- name: string → nombre visible del producto.
- price: number | null | undefined → precio unitario.
- image: string (opcional)
#### ProductCard
- useCartActions(): Hook que provee acciones del carrito.
- formatCOP(): Da formato en pesos,si el precio existe, se muestra formateado; si no, se reemplaza por '$$$'.
- handleAdd() :Verifica que el precio sea numérico, crea el objeto payload con los datos del producto y añade al carrito.
- return: contenedor principal(visualización)

## Shelf.tsx
Componente cliente que muestra una fila horizontal de productos desplazable con flechas.
- title: nombre del estante(ofertas, recomendados, categoria)
- Products: lista de productos
- VISIBLE_CARDS: tarjetas visibles antes de las flechas
- trackRef: referencia al contenedor que tiene el scroll horizontal.
- canLeft, canRight: controlan si las flechas están habilitadas según la posición actual del scroll.
- showArrows: depende de VISIBLE_cARDS si hay mas de esa cantidad en la lista
- updateArrows(): Calcula si se puede hacer scroll hacia la izquierda o derecha.
- useEffect(): Llama a updateArrows() al montar o cuando cambia showArrows.
- scrollAmount(): Determina cuánto desplazarse por click.
- goLeft() / goRight(): Mueven el carrusel suavemente
- Return(visualizacion):
  - Titulo esstante h3
  - Contenedor principal: shelfWrap
