'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './styles.module.css';

export default function ResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // evita navegar sin llamar al API
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
      }

      // si todo bien, ahora sí navega (opcional)
      router.push('/sent'); // o muestra un mensaje en la misma página
    } catch (err: any) {
      console.error('Forgot error:', err?.message);
      alert(err?.message ?? 'No se pudo enviar el enlace.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Recuperar contraseña</h2>

      <label className={styles.label}>Correo</label>
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Correo"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar correo'}
      </button>

      <p className={styles.helper}>
        <Link href="/login" className={styles.link}>Regresar</Link>
      </p>
    </form>
  );
}
 
