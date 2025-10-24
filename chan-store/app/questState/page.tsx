'use client';

import { useState } from 'react';
import styles from './styles.module.css';

// Ajusta estas rutas si tus componentes viven en otro directorio:
import LeftSidebar from '@/chrome/LeftSidebar';
import CartDrawer, { type CartItem } from '@/cart/CartDrawer';
// o, si prefieres, directo del archivo de tipos:
// import type { CartItem } from '@/cart/cart.types';


type Order = {
  id: string;
  status: string;
  name: string;
  date: string;
  price: string; // ya formateado
  qty: number;
  image?: string;
};

const MOCK_ORDERS: Order[] = [
  { id: 'o1', status: 'Estado pedido', name: 'Nombre artículo', date: 'Fecha', price: 'Precio', qty: 1 },
  { id: 'o2', status: 'Estado pedido', name: 'Nombre artículo', date: 'Fecha', price: 'Precio', qty: 1 },
  { id: 'o3', status: 'Estado pedido', name: 'Nombre artículo', date: 'Fecha', price: 'Precio', qty: 1 },
];

export default function QuestStatePage() {
  // Menú lateral y carrito
  const [openLeft, setOpenLeft] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  // El Drawer del carrito necesita estos props (placeholder por ahora)
  const [items, setItems] = useState<CartItem[]>([]);
  const inc = (id: string) =>
    setItems(prev => prev.map(it => (it._id === id ? { ...it, qty: it.qty + 1 } : it)));
  const dec = (id: string) =>
    setItems(prev => prev.map(it => (it._id === id && it.qty > 1 ? { ...it, qty: it.qty - 1 } : it)));
  const checkout = () => {};

  return (
    <div className={styles.page}>

      {/* Espaciador bajo el header sticky para que nada se tape */}
      <div className={styles.headerSpacer} />

      <main className={styles.container}>
        <ul className={styles.list}>
          {MOCK_ORDERS.map(o => (
            <li key={o.id} className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.rowTop}>
                  <span className={styles.labelStrong}>{o.status}</span>
                  <span className={`${styles.labelStrong} ${styles.right}`}>Fecha</span>
                </div>

                <div className={styles.rowMiddle}>
                  <div className={styles.thumb} aria-hidden />
                  <div className={styles.nameWrap}>
                    <span className={styles.smallMuted}>Nombre artículo</span>
                  </div>
                  <div className={styles.priceQty}>
                    <span className={styles.smallMuted}>Precio / cantidad</span>
                  </div>
                </div>
              </div>

              <button className={styles.detailsBtn}>Más detalles</button>
            </li>
          ))}
        </ul>
      </main>

      <LeftSidebar open={openLeft} onClose={() => setOpenLeft(false)} />

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        items={items}
        onInc={inc}
        onDec={dec}
        onCheckout={checkout}
      />
    </div>
  );
}
