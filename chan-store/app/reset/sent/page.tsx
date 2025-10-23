import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles.module.css';

export default function ResetSentPage() {
  return (
    <main className={styles.container}>
      <section className={styles.left}>
        <Image src="/cart-icon.svg" alt="Carrito" width={280} height={280} className={styles.image}/>
      </section>

      <section className={styles.right}>
        <div className={styles.card}>
          <p style={{ margin: 0, marginBottom: 12, color: '#0f172a' }}>
            Se ha enviado un correo para recuperar su contraseña.
          </p>
          <Link href="/login" className={styles.buttonLink}>
            Regresar
          </Link>
        </div>
      </section>
    </main>
  );
}
