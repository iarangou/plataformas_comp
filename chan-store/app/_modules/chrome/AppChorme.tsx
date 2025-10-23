// app/_modules/chrome/AppChrome.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Header from './Header';
import LeftSidebar from './LeftSidebar';
import CartDrawer from '../cart/CartDrawer';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { CartProvider, useCart, useCartActions } from '../cart/CartProvider';

function InnerChrome({ children }: { children: React.ReactNode }) {
  const [openLeft, setOpenLeft] = useState(false);
  const { items, count, open } = useCart();
  const { open: openCart, close: closeCart, inc, dec } = useCartActions();

  const pathname = usePathname();
  const isProfile = pathname === '/profile';
  const isFavorites = pathname === '/favorites';

  useBodyScrollLock(openLeft || open);

  return (
    <>
      <Header
        cartCount={count}
        onOpenMenu={() => setOpenLeft(true)}
        onOpenCart={openCart}
        title={isProfile ? 'Mi Perfil' : isFavorites ? 'Favoritos' : undefined}
        showSearch={!(isProfile || isFavorites)}
      />

      <LeftSidebar open={openLeft} onClose={() => setOpenLeft(false)} />

      <CartDrawer
        open={open}
        onClose={closeCart}
        items={items}
        onInc={inc}
        onDec={dec}
        onCheckout={() => { /* TODO: navegar a /checkout */ }}
      />

      {children}
    </>
  );
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 🔒 rutas donde NO queremos mostrar Header/Sidebar/Carrito
  const hideChrome = /^\/(login|register|reset|sent)(\/|$)/.test(pathname);

  if (hideChrome) {
    // sin provider, sin header, sin drawer: solo la página
    return <>{children}</>;
  }

  // resto de la app con chrome + carrito global
  return (
    <CartProvider>
      <InnerChrome>{children}</InnerChrome>
    </CartProvider>
  );
}
