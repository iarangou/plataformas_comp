import Image from 'next/image';
import ResetForm from './ResetForm';
import styles from './styles.module.css';

export default function ResetPage() {
  return (
    <main className={styles.container}>
      <section className={styles.left}>
        <Image src="/cart-icon.svg" alt="Carrito" width={280} height={280} className={styles.image}/>
      </section>

      <section className={styles.right}>
        <div className={styles.card}>
          <ResetForm />
        </div>
      </section>
    </main>
  );
}
