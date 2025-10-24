import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    image: { type: String, default: '' }, // URL (por ahora)
  },
  { timestamps: true }
);

export type ProductDoc = {
  _id: string; userId: string;
  name: string; description: string;
  price: number; stock: number; image: string;
  createdAt?: Date; updatedAt?: Date;
};

export default models.Product || mongoose.model('Product', ProductSchema);
