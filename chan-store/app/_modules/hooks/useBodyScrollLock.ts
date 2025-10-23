'use client';

import { useEffect, useRef } from 'react';

export function useBodyScrollLock(locked: boolean) {
  const prev = useRef<{ overflow?: string; paddingRight?: string }>({});

  useEffect(() => {
    if (!locked) {
      // Restaurar cuando se cierre
      document.body.style.overflow = prev.current.overflow ?? '';
      document.body.style.paddingRight = prev.current.paddingRight ?? '';
      return;
    }

    // Guardar estilos actuales
    prev.current.overflow = document.body.style.overflow;
    prev.current.paddingRight = document.body.style.paddingRight;

    // Calcular ancho de la barra de desplazamiento para evitar "salto"
    const scrollBarW = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollBarW > 0) {
      document.body.style.paddingRight = `${scrollBarW}px`;
    }

    return () => {
      // Limpieza por si el componente se desmonta con el lock activo
      document.body.style.overflow = prev.current.overflow ?? '';
      document.body.style.paddingRight = prev.current.paddingRight ?? '';
    };
  }, [locked]);
}
