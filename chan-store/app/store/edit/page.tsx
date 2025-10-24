'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';

type StoreDto = { name: string; description: string };

export default function StoreProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState<StoreDto>({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/store/profile', { cache: 'no-store' });
        const data = await res.json();
        if (data?.store) {
          setForm({
            name: data.store.name || '',
            description: data.store.description || '',
          });
        }
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch('/api/store/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'No se pudo guardar');
      setOkMsg('Cambios guardados');
    } catch (err:any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <main className={styles.main}>
        <section className={styles.panel}>
          <h2 className={styles.title}>Editar datos</h2>

          <form onSubmit={onSubmit} className={styles.form}>
            <label className={styles.label}>Nombre actual</label>
            <input
              className={styles.input}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Mi tienda"
              maxLength={60}
              required
            />

            <label className={styles.label}>Descripción actual</label>
            <textarea
              className={styles.textarea}
              name="description"
              value={form.description}
              onChange={onChange}
              rows={6}
              placeholder="Describe tu tienda..."
            />

            <div className={styles.actions}>
              <button className={styles.button} disabled={saving}>
                {saving ? 'Guardando…' : 'Actualizar'}
              </button>
            </div>

            {loading && <p className={styles.muted}>Cargando…</p>}
            {error && <p className={styles.error}>{error}</p>}
            {okMsg && <p className={styles.ok}>{okMsg}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
