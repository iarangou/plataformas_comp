// lib/models/Store.ts
import mongoose, { Schema, models } from 'mongoose';

const StoreSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.Store || mongoose.model('Store', StoreSchema);
