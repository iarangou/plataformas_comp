'use client';
import { createContext, useContext } from 'react';

type AddArgs = { _id: string; name: string; price: number; image?: string };

type CartActions = {
  add: (p: AddArgs) => void;
  inc?: (id: string) => void;
  dec?: (id: string) => void;
};

const CartActionsContext = createContext<CartActions>({ add: () => {} });

export function CartActionsProvider({
  value,
  children,
}: {
  value: CartActions;
  children: React.ReactNode;
}) {
  return <CartActionsContext.Provider value={value}>{children}</CartActionsContext.Provider>;
}

export function useCartActions() {
  return useContext(CartActionsContext);
}
