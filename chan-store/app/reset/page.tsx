// app/reset/page.tsx
import Image from 'next/image';
import { redirect } from 'next/navigation';
import ResetForm from './ResetForm';
import styles from './styles.module.css';

export default async function ResetPage({
  searchParams,
}: {
  // En Next nuevo, searchParams es asíncrono
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const tokenParam = sp?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  // Compatibilidad: si alguien llega con ?token=..., redirige al path param
  if (token) {
    redirect(`/reset/${encodeURIComponent(token)}`);
  }

  // Sin token → vista "Olvidé mi contraseña"
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
          <ResetForm />
        </div>
      </section>
    </main>
  );
}
