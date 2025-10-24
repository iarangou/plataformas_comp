// app/store/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';

// 👇 Tipo mínimo del documento que nos interesa cuando usamos .lean()
type StoreLean = {
  _id?: string;
  userId?: string;
  name?: string;
  description?: string;
  image?: string;
};

async function getStoreName() {
  const jar = await cookies();
  const token = jar.get('token')?.value;
  if (!token) return 'Nombre tienda';

  const secretStr =
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    '';
  if (!secretStr) return 'Nombre tienda';

  try {
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret);

    const userId =
      (payload as any).id || (payload as any)._id || (payload as any).sub;
    if (!userId) return 'Nombre tienda';

    await connectDB();

    // 👇 seleccionamos solo 'name' y tipamos el lean para que TS conozca el shape
    const store = await Store.findOne({ userId })
      .select('name')
      .lean<StoreLean>();

    return store?.name ?? 'Nombre tienda';
  } catch {
    return 'Nombre tienda';
  }
}

export default async function StorePage() {
  const storeName = await getStoreName();

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <main className={styles.main}>
        <section className={styles.card}>
          {/* Lado izquierdo con círculo y arte */}
          <div className={styles.left}>
            <div className={styles.circle} />
            <div className={styles.illustration}>
              <Image
                src="/store-hero.svg"
                alt="Ilustración tienda"
                fill
                sizes="260px"
                className={styles.illustrationImg}
                priority
              />
            </div>

            <button className={styles.cameraBtn} aria-label="Cambiar imagen de la tienda">
              <span className={styles.cameraEmoji}>📷</span>
            </button>
          </div>

          {/* Lado derecho con título y acciones */}
          <div className={styles.right}>
            <h1 className={styles.title}>{storeName}</h1>

            <nav className={styles.actions}>
              <Link className={styles.btn} href="/store/edit">Editar datos</Link>
              <Link className={styles.btn} href="/product">Mis productos</Link>
              <Link className={styles.btn} href="/orders">Gestionar ordenes</Link>
            </nav>

            <section className={styles.stats}>
              <h2 className={styles.statsTitle}>Estadísticas</h2>
              <div className={styles.dash} />
              <div className={styles.dash} />
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
