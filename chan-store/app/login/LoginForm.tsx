'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './styles.module.css';

type FormState = { email: string; password: string; remember: boolean };

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'No se pudo iniciar sesión');

      // éxito: cookie queda guardada => redirige
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.title}>Iniciar sesión</h2>

      <label className={styles.label}>Correo</label>
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={onChange}
        required
      />

      <label className={styles.label}>Contraseña</label>
      <input
        className={styles.input}
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={onChange}
        required
      />

      <div className={styles.row}>
        <label className={styles.check}>
          <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} />
          Recuérdame
        </label>
        <Link href="/reset" className={styles.link}>¿Olvidaste la contraseña?</Link>
      </div>

      {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Ingresando…' : 'Entrar'}
      </button>

      <p className={styles.helper}>
        ¿No tienes cuenta? <Link className={styles.link} href="/register">Regístrate</Link>
      </p>
    </form>
  );
}
