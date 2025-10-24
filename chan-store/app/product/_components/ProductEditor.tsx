'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../editor.module.css';

type Form = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string; // 1 URL; API usa images: string[]
};

export default function ProductEditor({ id }: { id?: string }) {
  const router = useRouter();
  const isNew = !id;

  const [form, setForm] = useState<Form>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/my-products/${id}`, { cache: 'no-store' });
        const d = await r.json();
        if (r.ok && d) {
          setForm({
            name: d.name ?? '',
            description: d.description ?? '',
            price: Number(d.price ?? 0),
            stock: Number(d.stock ?? 0),
            image: Array.isArray(d.images) && d.images[0] ? d.images[0] : '',
          });
        } else {
          setErr(d?.error || 'No se pudo cargar el producto');
        }
      } catch {
        setErr('No se pudo cargar el producto');
      }
    })();
  }, [id]);

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v =
        e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [k]: v as any }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        images: form.image ? [form.image] : [],
      };

      const r = await fetch(
        isNew ? '/api/my-products' : `/api/my-products/${id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'No se pudo guardar');

      router.push('/product');
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {/* IZQUIERDA: cuadro grande */}
      <div className={styles.left}>
        <div className={styles.imageBox}>
          {form.image ? (
            <img src={form.image} alt="" className={styles.preview} />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>
      </div>

      {/* DERECHA: campos con subtítulo + casilla claras */}
      <div className={styles.right}>
        {/* Nombre */}
        <div className={styles.field}>
          <label className={styles.smallLabel}>Nombre producto</label>
          <input
            className={styles.nameInput}
            value={form.name}
            onChange={set('name')}
            placeholder="Ej. Camiseta clásica"
            required
          />
        </div>

        {/* Descripción */}
        <div className={styles.field}>
          <label className={styles.smallLabel}>Descripción actual</label>
          <textarea
            className={styles.blueInput}
            rows={3}
            value={form.description}
            onChange={set('description')}
            placeholder="Describe tu producto…"
          />
        </div>

        {/* Imagen */}
        <div className={styles.field}>
          <label className={styles.smallLabel}>Imagen (URL)</label>
          <input
            className={styles.blueInput}
            value={form.image}
            onChange={set('image')}
            placeholder="https://…"
          />
        </div>

        {/* Precio y unidades (líneas) */}
        <div className={`${styles.field} ${styles.linesGroup}`}>
          <div className={styles.lineField}>
            <span className={styles.lineLabel}>precio</span>
            <input
              type="number"
              step="0.01"
              className={styles.lineInput}
              value={form.price}
              onChange={set('price')}
              placeholder="0.00"
            />
          </div>
          <div className={styles.lineField}>
            <span className={styles.lineLabel}>unidades disponibles</span>
            <input
              type="number"
              className={styles.lineInput}
              value={form.stock}
              onChange={set('stock')}
              placeholder="0"
            />
          </div>
        </div>

        <button className={styles.cta} disabled={saving}>
          {saving ? (isNew ? 'Añadiendo…' : 'Guardando…') : isNew ? 'Añadir' : 'Actualizar'}
        </button>

        {err && <p className={styles.error}>{err}</p>}
      </div>
    </form>
  );
}
