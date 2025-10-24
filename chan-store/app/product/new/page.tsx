import styles from '../styles.module.css';
import ProductEditor from '../_components/ProductEditor';

export default function NewProductPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <main className={styles.main}>
        <ProductEditor />
      </main>
    </div>
  );
}
