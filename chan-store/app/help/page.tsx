'use client';

import styles from './styles.module.css';

export default function HelpPage() {
  const faqs = [
    { q: '¿Cómo creo una cuenta?', a: 'Ve a “Registrar” y completa nombre, correo y contraseña.' },
    { q: 'Olvidé mi contraseña', a: 'Usa “¿Olvidaste tu contraseña?” y sigue el enlace enviado a tu correo.' },
    { q: 'Métodos de pago', a: 'Tarjetas débito/crédito y billeteras digitales disponibles por región.' },
    { q: '¿Cómo uso el carrito?', a: 'Agrega productos y abre el ícono del carrito para ajustar cantidades.' },
    { q: 'Tiempos de envío', a: 'Se calculan por ciudad y se muestran antes del pago.' },
  ];

  return (
    <div className={styles.page}>
      {/* Espaciador para el header global */}
      <div className={styles.headerSpacer} />

      <main className={styles.main}>
        <section className={styles.card}>
          <h1 className={styles.pageTitle}>Preguntas Frecuentes</h1>
          <ul className={styles.faqList}>
            {faqs.map(({ q, a }, i) => (
              <li key={i} className={styles.faqItem}>
                <details className={styles.faqDetails}>
                  <summary className={styles.faqQuestion}>{q}</summary>
                  <p className={styles.faqAnswer}>{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
