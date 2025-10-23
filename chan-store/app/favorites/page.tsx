'use client';

import styles from './styles.module.css';

export default function FavoritesPage() {
  const favorites: any[] = [];

  return (
    <div className={styles.pageBg}>
      <main className={styles.main}>
        <section className={styles.panel}>
          {favorites.length === 0 ? (
            <div className={styles.empty}>
              <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.4 9l6.7-.9L12 2z" fill="currentColor"/>
              </svg>
              <p className={styles.emptyText}>no hay productos listados</p>
            </div>
          ) : (
            <ul className={styles.list}>{/* ... */}</ul>
          )}
        </section>
      </main>
    </div>
  );
}
