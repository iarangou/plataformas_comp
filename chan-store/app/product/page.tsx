// app/product/page.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import styles from './styles.module.css';

type ProductItem = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
};

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

async function getData(): Promise<ProductItem[]> {
  const base = await getBaseUrl();

  // Usa el endpoint que prefieras:
  // 1) El global existente:
  // const url = `${base}/api/products?limit=50`;

  // 2) (Recomendado) El nuevo endpoint "mis productos":
  const url = `${base}/api/my-products?limit=50`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();

  // /api/products devuelve { data, page, ... }
  // /api/my-products devuelve { data, page, ... } también.
  return Array.isArray(json?.data) ? json.data : [];
}

export default async function MyProductsPage() {
  const items = await getData();

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <main className={styles.main}>
        <section className={styles.list}>
          {/* Tarjeta "Añadir artículo" */}
          <Link className={`${styles.card} ${styles.addCard}`} href="/product/new">
            <span className={styles.bigPlus}>+</span>
            <span className={styles.addText}>Añadir artículo</span>
          </Link>

          {/* Items */}
          {items.map((it) => (
            <Link key={it._id} className={styles.card} href={`/product/${it._id}`}>
              <div className={styles.thumb}>
                {it.images?.[0] ? <img src={it.images[0]} alt="" /> : null}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.name}>{it.name}</h3>
                <p className={styles.desc}>{it.description || 'Sin descripción'}</p>
                <p className={styles.small}>Precio: {it.price ?? 0}</p>
                <p className={styles.small}>Unidades: {it.stock ?? 0}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
