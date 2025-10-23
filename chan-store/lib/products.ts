// lib/products.ts
import { connectDB } from './mongodb';
import Product from '@/models/Product';

/**
 * Estructura de datos que usan los componentes del dashboard
 * (para tipar los props y mantener consistencia con MongoDB)
 */
export type ProductDTO = {
  _id: string;
  name: string;
  price: number;
  category: string;
  rating?: number;
  sales?: number;
  image?: string;
};

/**
 * Convierte un documento de Mongoose a un objeto plano (DTO)
 */
function toDTO(doc: any): ProductDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    category: doc.category,
    rating: doc.rating ?? undefined,
    sales: doc.sales ?? undefined,
    image: doc.image ?? undefined,
  };
}

/**
 * Retorna los productos ordenados por cantidad de ventas
 */
export async function getTopSales(limit = 10): Promise<ProductDTO[]> {
  await connectDB();
  const docs = await Product.find({}).sort({ sales: -1, _id: -1 }).limit(limit).lean();
  return docs.map(toDTO);
}

/**
 * Retorna productos sugeridos, actualmente ordenados por rating descendente
 */
export async function getSuggested(_userId: string, limit = 10): Promise<ProductDTO[]> {
  await connectDB();
  const docs = await Product.find({}).sort({ rating: -1, _id: -1 }).limit(limit).lean();
  return docs.map(toDTO);
}

/**
 * Retorna productos filtrados por categoría
 */
export async function getByCategory(category: string, limit = 10): Promise<ProductDTO[]> {
  await connectDB();
  const docs = await Product.find({ category }).sort({ _id: -1 }).limit(limit).lean();
  return docs.map(toDTO);
}
