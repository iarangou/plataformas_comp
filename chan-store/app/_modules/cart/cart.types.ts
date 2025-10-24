// app/_modules/cart/cart.types.ts
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export type AddToCartInput = Pick<CartItem, '_id' | 'name' | 'price' | 'image'>;

export interface CartActions {
  add: (p: AddToCartInput) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export interface CartSelectors {
  items: CartItem[];
  open: boolean;
  count: number;
  total: number;
}

