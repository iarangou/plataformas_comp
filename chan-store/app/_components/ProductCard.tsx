'use client';
import styles from '../home/styles.module.css';
import { formatCOP } from '@/lib/currency';
import { useCartActions } from './CartActionsContext';

type Props = {
  id: string;
  name: string;
  price: number | null | undefined;
  image?: string;
};

export default function ProductCard({ id, name, price, image }: Props) {
  const { add } = useCartActions();
  const priceText = typeof price === 'number' ? formatCOP(price) : '$$$';

  const handleAdd = () => {
    if (typeof price !== 'number') return;
    add({ _id: id, name, price, image });
  };

  return (
    <div className={styles.card} title={name}>
      <div className={styles.cardThumb}>
        {image ? <img src={image} alt={name} className={styles.cardImg} /> : <div className={styles.cardPh} />}
      </div>

      <div className={styles.cardMeta}>
        <span className={styles.cardName}>{name}</span>
        <span className={styles.cardPrice}>{priceText}</span>
      </div>

      <button className={styles.addBtn} onClick={handleAdd} disabled={typeof price !== 'number'}>
        Agregar
      </button>
    </div>
  );
}
