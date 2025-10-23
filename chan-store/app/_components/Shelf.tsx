'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import styles from '../home/styles.module.css';
import type { IProduct } from '@/models/Product';

const VISIBLE_CARDS = 5;

export default function Shelf({ title, products }: { title: string; products: IProduct[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const showArrows = (products?.length ?? 0) > VISIBLE_CARDS;

  const updateArrows = useCallback(() => {
    if (!showArrows) {           // si no hay flechas, forza estado
      setCanLeft(false);
      setCanRight(false);
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < maxScroll - 4);
  }, [showArrows]);               

  useEffect(() => {
    // correr al montar / cambiar showArrows
    updateArrows();

    const el = trackRef.current;
    if (!el || !showArrows) return; // no suscribirse si no hay flechas

    const onScroll = () => updateArrows();
    const ro = new ResizeObserver(() => updateArrows());

    el.addEventListener('scroll', onScroll, { passive: true });
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [showArrows, updateArrows]);  

  const scrollAmount = () => {
    const el = trackRef.current;
    if (!el) return 0;
    return Math.max(160 * 3, Math.floor(el.clientWidth * 0.9)); // 160 = --card-w
  };

  const goLeft  = () => trackRef.current?.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  const goRight = () => trackRef.current?.scrollBy({ left:  scrollAmount(), behavior: 'smooth' });

  if (!products?.length) return null;

  return (
    <section className={styles.shelfSec}>
      <h3 className={styles.shelfTitle}>{title}</h3>

      <div className={styles.shelfWrap}>
        {showArrows && (
          <button
            className={`${styles.shelfBtn} ${styles.shelfBtnLeft}`}
            onClick={goLeft}
            aria-label={`Ver más de ${title} hacia la izquierda`}
            disabled={!canLeft}
          >
            ‹
          </button>
        )}

        <div
          ref={trackRef}
          className={styles.shelf}
          role="list"
          aria-label={`Carrusel de ${title}`}
          style={!showArrows ? { overflowX: 'hidden' } : undefined}
        >
          {products.map((p) => (
            <div role="listitem" key={String(p._id)}>
              <ProductCard id={String(p._id)} name={p.name} price={p.price} image={p.image} />
            </div>
          ))}
        </div>

        {showArrows && (
          <button
            className={`${styles.shelfBtn} ${styles.shelfBtnRight}`}
            onClick={goRight}
            aria-label={`Ver más de ${title} hacia la derecha`}
            disabled={!canRight}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
