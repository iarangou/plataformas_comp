'use client';
import Image from 'next/image';
import styles from '../home/styles.module.css';

export default function Header({
  cartCount = 0,
  onOpenMenu,
  onOpenCart,
  title,             
  showSearch = true,  
}: {
  cartCount?: number;
  onOpenMenu?: () => void;
  onOpenCart?: () => void;
  title?: string;           // si existe, se centra como en el mock
  showSearch?: boolean;     // false para ocultar el buscador
}) {
  const hasItems = cartCount > 0;

  return (
    <header className={styles.header}>
      <button aria-label="Abrir menú" className={styles.iconBtn} onClick={onOpenMenu}>
        <span className={styles.burger}></span>
      </button>

      {/* Centro: o título o logo+search */}
      {title ? (
        <div className={styles.centerGroup}>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      ) : (
        <div className={styles.centerGroup}>
          <div className={styles.brand}>
            <Image src="/cart-icon.svg" alt="Logo" width={36} height={36} className={styles.logo} priority />
          </div>
          {showSearch && (
            <div className={styles.searchWrap}>
              <input className={styles.search} placeholder="Search" type="search" />
            </div>
          )}
        </div>
      )}

      <button
        aria-label={hasItems ? `Abrir carrito, ${cartCount} productos` : 'Abrir carrito'}
        className={`${styles.iconBtn} ${styles.cartBtn}`}
        onClick={onOpenCart}
      >
        <Image src="/buyingCart.svg" alt="Carrito de compras" width={22} height={22} />
        {hasItems && <span className={styles.cartBtnHasItems} />} {/* badge condicional */}
      </button>
    </header>
  );
}
