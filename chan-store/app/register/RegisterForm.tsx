'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validaciones simples antes de enviar
    const trimmedName = form.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return setError('El nombre debe tener entre 2 y 60 caracteres');
    }

    if (form.email !== form.confirmEmail) {
      return setError('Los correos no coinciden');
    }

    if (form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrar');

      setSuccess('Registro exitoso. Redirigiendo...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.title}>Registrarse</h2>

      {/* Nombre */}
      <label className={styles.label}>Nombre</label>
      <input
        type="text"
        name="name"
        placeholder="Tu nombre"
        value={form.name}
        onChange={onChange}
        required
        minLength={2}
        maxLength={60}
        className={styles.input}
      />

      {/* Correo */}
      <label className={styles.label}>Correo</label>
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={onChange}
        required
        className={styles.input}
      />

      <label className={styles.label}>Confirmar Correo</label>
      <input
        type="email"
        name="confirmEmail"
        placeholder="Confirmar correo"
        value={form.confirmEmail}
        onChange={onChange}
        required
        className={styles.input}
      />

      {/* Contraseña */}
      <label className={styles.label}>Contraseña</label>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={onChange}
        required
        className={styles.input}
        minLength={6}
      />

      <label className={styles.label}>Confirmar Contraseña</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        value={form.confirmPassword}
        onChange={onChange}
        required
        className={styles.input}
        minLength={6}
      />

      {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      {success && <p style={{ color: 'green', fontSize: '13px' }}>{success}</p>}

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <p className={styles.helper}>
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className={styles.link}>Inicia sesión</a>
      </p>
    </form>
  );
}
