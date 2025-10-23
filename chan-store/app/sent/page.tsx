import Image from 'next/image';
import styles from './sent.module.css';

export default function SentPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <Image
          src="/cart-icon.svg" // Asegúrate de tener este archivo en /public
          alt="ChanStore"
          width={120}
          height={120}
          priority
          className={styles.logo}
        />

        <h1 className={styles.title}>Correo enviado</h1>
        <p className={styles.text}>
          Si el correo existe, te enviamos un enlace para restablecer la contraseña.
          Ya puedes cerrar esta ventana.
        </p>
      </div>
    </main>
  );
}
