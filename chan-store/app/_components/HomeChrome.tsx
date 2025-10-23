'use client';

import { useMemo, useState } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import CartDrawer, { CartItem } from './CartDrawer';
import { useBodyScrollLock } from './useBodyScrollLock';
import { CartActionsProvider } from './CartActionsContext';
import { usePathname } from 'next/navigation';

export default function HomeChrome({ children }: { children: React.ReactNode }) {
  const [openLeft, setOpenLeft] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const cartCount = useMemo(() => cart.reduce((a, b) => a + b.qty, 0), [cart]);

  const pathname = usePathname();
  const isProfile = pathname === '/profile';
  useBodyScrollLock(openLeft || openCart);

  // ---- acciones del carrito ----
  const add = ({ _id, name, price, image }: { _id: string; name: string; price: number; image?: string }) => {
    setCart(prev => {
      const i = prev.findIndex(it => it._id === _id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { _id, name, price, image, qty: 1 }];
    });
    setOpenCart(true); // opcional: abre el carrito al añadir
  };

  const inc = (id: string) => {
    setCart(prev => prev.map(it => (it._id === id ? { ...it, qty: it.qty + 1 } : it)));
  };
  const dec = (id: string) => {
    setCart(prev => prev.map(it => (it._id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it)).filter(it => it.qty > 0));
  };

  const onCheckout = () => { alert('Checkout (demo)'); };

  return (
    <CartActionsProvider value={{ add, inc, dec }}>
      <Header
        cartCount={cartCount}
        onOpenMenu={() => setOpenLeft(true)}
        onOpenCart={() => setOpenCart(true)}
        title={isProfile ? 'Mi Perfil' : undefined}   
        showSearch={!isProfile} 
      />

      <LeftSidebar open={openLeft} onClose={() => setOpenLeft(false)} />

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        items={cart}
        onInc={inc}
        onDec={dec}
        onCheckout={onCheckout}
      />

      {children}
    </CartActionsProvider>
  );
}
