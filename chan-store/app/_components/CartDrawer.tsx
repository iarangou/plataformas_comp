'use client';

import Image from 'next/image';
import styles from '@/app/home/cart.module.css';
import { formatCOP } from '@/lib/currency';

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

export default function CartDrawer({
  open,
  onClose,
  items,
  onInc,
  onDec,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onCheckout: () => void;
}) {
  const count = items.reduce((a, b) => a + b.qty, 0);
  const total = items.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayShow : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="Carrito"
        aria-hidden={!open}
      >
        {/* Top azul oscuro con icono y badge */}
        <div className={styles.top}>
          <div className={styles.cartIconWrap}>
            <Image src="/buyingCart.svg" alt="Carrito" width={28} height={28} />
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </div>
        </div>

        {/* Contenido */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>Carrito vacío</div>
          ) : (
            <ul className={styles.list}>
              {items.map((it) => (
                <li key={it._id} className={styles.row}>
                  <div className={styles.thumb}>
                    {it.image ? (
                      <img src={it.image} alt={it.name} />
                    ) : (
                      <div className={styles.thumbPh} />
                    )}
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.title}>{it.name}</div>

                    <div className={styles.qtyLine}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => onDec(it._id)}
                        aria-label={`Quitar uno de ${it.name}`}
                      >
                        –
                      </button>
                      <span className={styles.qtyVal}>{it.qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => onInc(it._id)}
                        aria-label={`Agregar uno de ${it.name}`}
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.priceLine}>
                      <span className={styles.priceLabel}>Precio</span>
                      <span className={styles.priceVal}>
                        {formatCOP(it.price * it.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer total + checkout */}
        <div className={styles.footer}>
          <div className={styles.totalLine}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalVal}>{formatCOP(total)}</span>
          </div>
          <button
            className={styles.checkout}
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Check out
          </button>
        </div>
      </aside>
    </>
  );
}
