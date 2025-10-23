import { connectToDB } from '@/lib/db';
import { Product } from '@/models/Product';
import Shelf from '@/app/_modules/product/Shelf';
import styles from './styles.module.css';

export const revalidate = 0;

export default async function HomePage() {
  await connectToDB();
  const [topSale, suggested] = await Promise.all([
    Product.find({ isTopSale: true }).limit(20).lean(),
    Product.find({ isSuggested: true }).limit(20).lean(),
  ]);
  const categories: string[] = await Product.distinct('category');
  const categoryShelves = await Promise.all(
    categories.map(async (cat) => ({ cat, items: await Product.find({ category: cat }).limit(20).lean() }))
  );

  return (
    <div className={styles.page}>
      
        <main className={styles.main}>
          <Shelf title="TOP SALE" products={JSON.parse(JSON.stringify(topSale))} />
          <Shelf title="Sugeridos" products={JSON.parse(JSON.stringify(suggested))} />
          {categoryShelves.map(({ cat, items }) => (
            <Shelf key={cat} title={cat} products={JSON.parse(JSON.stringify(items))} />
          ))}
        </main>
      
    </div>
  );
}
