'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CartItem, AddToCartInput, CartActions, CartSelectors } from './cart.types';

type State = { items: CartItem[]; open: boolean };
type Action =
  | { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'CLEAR' }
  | { type: 'ADD'; payload: AddToCartInput }
  | { type: 'INC'; id: string }
  | { type: 'DEC'; id: string }
  | { type: 'HYDRATE'; payload: CartItem[] };

const STORAGE_KEY = 'chan.cart';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN': return { ...state, open: true };
    case 'CLOSE': return { ...state, open: false };
    case 'CLEAR': return { ...state, items: [] };
    case 'HYDRATE': return { ...state, items: action.payload ?? [] };
    case 'ADD': {
      const { _id, name, price, image } = action.payload;
      const idx = state.items.findIndex(i => i._id === _id);
      const items = [...state.items];
      if (idx === -1) items.push({ _id, name, price, image, qty: 1 });
      else items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
      return { ...state, items };
    }
    case 'INC': {
      const items = state.items.map(i => i._id === action.id ? { ...i, qty: i.qty + 1 } : i);
      return { ...state, items };
    }
    case 'DEC': {
      const next = state.items
        .map(i => i._id === action.id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
      return { ...state, items: next };
    }
    default: return state;
  }
}

const CartStateCtx = createContext<CartSelectors | null>(null);
const CartActionsCtx = createContext<CartActions | null>(null);

export function useCart() {
  const ctx = useContext(CartStateCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
export function useCartActions() {
  const ctx = useContext(CartActionsCtx);
  if (!ctx) throw new Error('useCartActions must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false });

  // Hydrate desde localStorage al montar
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {}
  }, []);

  // Persistir en localStorage ante cambios
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const selectors: CartSelectors = useMemo(() => {
    const count = state.items.reduce((a, b) => a + b.qty, 0);
    const total = state.items.reduce((a, b) => a + b.qty * b.price, 0);
    return { items: state.items, open: state.open, count, total };
  }, [state.items, state.open]);

  const actions: CartActions = useMemo(() => ({
    add: (p) => dispatch({ type: 'ADD', payload: p }),
    inc: (id) => dispatch({ type: 'INC', id }),
    dec: (id) => dispatch({ type: 'DEC', id }),
    clear: () => dispatch({ type: 'CLEAR' }),
    open: () => dispatch({ type: 'OPEN' }),
    close: () => dispatch({ type: 'CLOSE' }),
  }), []);

  return (
    <CartStateCtx.Provider value={selectors}>
      <CartActionsCtx.Provider value={actions}>
        {children}
      </CartActionsCtx.Provider>
    </CartStateCtx.Provider>
  );
}
