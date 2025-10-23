import Image from 'next/image';
import RegisterForm from './RegisterForm';
import styles from './styles.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.container}>
      <section className={styles.left}>
        {/* usa /public/cart-icon.svg */}
        <Image src="/cart-icon.svg" alt="Carrito" width={280} height={280} className={styles.image}/>
      </section>

      <section className={styles.right}>
        <div className={styles.card}>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}

