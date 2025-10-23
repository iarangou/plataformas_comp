import Image from 'next/image';
import LoginForm from './LoginForm';
import styles from './styles.module.css';

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <section className={styles.left}>
        <Image
          src="/cart-icon.svg"   // usa tu ícono en /public
          alt="Carrito"
          width={280}
          height={280}
          className={styles.image}
        />
      </section>

      <section className={styles.right}>
        <div className={styles.card}>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
 
