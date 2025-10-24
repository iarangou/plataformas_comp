// app/reset/[token]/page.tsx
import Image from 'next/image';
import TokenForm from './TokenForm';
import styles from '../styles.module.css';

export default async function ResetWithTokenPage({
  params,
}: {
  // En Next nuevo, params es asíncrono
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className={styles.container}>
      <section className={styles.left}>
        <Image
          src="/cart-icon.svg"
          alt="Carrito"
          width={280}
          height={280}
          className={styles.image}
        />
      </section>

      <section className={styles.right}>
        <div className={styles.card}>
          <TokenForm token={token} />
        </div>
      </section>
    </main>
  );
}
