import { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  price: number;          // en la moneda que uses
  image?: string;         // URL de imagen
  category: string;       // ej: "Bebidas", "Snacks", etc.
  isTopSale?: boolean;    // para la sección Top Sale
  isSuggested?: boolean;  // para "Sugeridos"
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, required: true, index: true },
    isTopSale: { type: Boolean, default: false },
    isSuggested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
