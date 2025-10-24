import styles from '../styles.module.css';
import ProductEditor from '../_components/ProductEditor';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <main className={styles.main}>
        <ProductEditor id={params.id} />
      </main>
    </div>
  );
}
