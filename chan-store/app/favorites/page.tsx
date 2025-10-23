'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

import LeftSidebar from '../_components/LeftSidebar';
import CartDrawer, { type CartItem } from '../_components/CartDrawer';

export default function FavoritesPage() {
  // Estados para abrir/cerrar menús
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Carrito (vacío por ahora; requerido por CartDrawer)
  const [items, setItems] = useState<CartItem[]>([]);

  // Handlers mínimos para CartDrawer
  const handleInc = (id: string) =>
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const handleDec = (id: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it._id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );

  const handleCheckout = () => {
    // Integra tu flujo de pago aquí
    console.log('checkout');
  };

  // Favoritos (vacío → debe mostrarse la estrella + mensaje)
  const favorites: any[] = [];

  return (
    <div className={styles.page}>
      {/* Drawer izquierdo (overlay) */}
      <LeftSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Drawer del carrito (overlay) */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onInc={handleInc}
        onDec={handleDec}
        onCheckout={handleCheckout}
      />

      {/* Contenido */}
      <main className={styles.main}>
        {/* Topbar azul como en el mock */}
        <header className={styles.header}>
          <button
            className={styles.cartBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            title="Abrir menú"
          >
            {/* ícono simple de “hamburger” (puedes reemplazar por un SVG) */}
            <span style={{ fontSize: 22, lineHeight: 1 }}>☰</span>
          </button>

          <h1 className={styles.title}>Favoritos</h1>

          <button
            className={`${styles.cartBtn} ${styles.cartBtnCart}`}
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
            title="Abrir carrito"
            >
            <Image src="/buyingCart.svg" alt="Carrito" width={28} height={28} priority />
            </button>
        </header>

        {/* Panel blanco centrado y ancho constante */}
        <section className={styles.panel}>
          {favorites.length === 0 ? (
            <div className={styles.empty}>
              {/* Estrella (estado vacío) */}
              <svg
                className={styles.star}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 2l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.4 9l6.7-.9L12 2z"
                  fill="currentColor"
                />
              </svg>
              <p className={styles.emptyText}>no hay productos listados</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {/* Cuando tengas datos, mapea aquí tus favoritos (ej. ProductCard) */}
              {/* {favorites.map((p) => (
                <li key={p._id} className={styles.item}>
                  <ProductCard {...p} />
                </li>
              ))} */}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
