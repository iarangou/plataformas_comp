import { Schema, model, models } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  address: { type: String },
  avatarUrl: { type: String },
}, { timestamps: true });

export const User = models.User || model<IUser>('User', UserSchema);
