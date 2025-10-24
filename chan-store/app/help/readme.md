## styles.module.css
- Página
  - .page → fondo blanco, altura completa (100vh), layout vertical (flex-column).
  - .main → grid centrado horizontalmente, padding amplio (24px 16px 48px).
- Header
  - .header → barra azul oscuro (#0d3b66), sticky arriba, grid de 3 columnas (48px 1fr 48px), alineada al centro.
  - .iconBtn, .cartBtn → botones cuadrados (36 px), sin fondo, color blanco, borde redondeado (8 px), cursor pointer.
  - .title → texto centrado, blanco, negrita, 22 px (24 px en pantallas ≥768 px).
- Contenedor principal
  -  .card → bloque azul claro (#4a90e2), borde redondeado (14 px), padding generoso, sombra suave y borde translúcido.
  - Usado como contenedor del contenido de ayuda o preguntas frecuentes.
- FAQ
  - .faqList → lista sin bullets ni márgenes; separación entre ítems
  - .faqDetails → recuadro con fondo translúcido, borde dashed blanco semitransparente y esquinas redondeadas.
  - .faqQuestion → texto clicable, negrita, color azul oscuro
  - .faqAnswer → bloque con fondo blanco semitransparente, padding 10 px, bordes redondeados (8 px), texto 14 px (15 px en ≥768 px).
- Responsive
  -  ≥768 px → incrementa tipografía (.title 24 px, .faqAnswer 15 px) y padding interno de .card.
## page.tsx
Define faqs: lista { q, a }.
- .page → layout general (fondo claro, columna).
- .headerSpacer → compensa el header fijo.
- .main → padding general.
- .card → panel blanco con sombra.
