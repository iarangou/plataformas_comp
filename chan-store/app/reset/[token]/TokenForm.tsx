'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles.module.css';

export default function TokenForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'No se pudo restablecer la contraseña');
      return;
    }
    // Éxito: enviar a login
    router.push('/login');
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.title}>Nueva contraseña</h2>

      <label className={styles.label}>Contraseña</label>
      <input
        className={styles.input}
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label className={styles.label}>Confirmar contraseña</label>
      <input
        className={styles.input}
        type="password"
        placeholder="Confirmar contraseña"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Guardando…' : 'Restablecer'}
      </button>
    </form>
  );
}

