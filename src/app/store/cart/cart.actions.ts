// Updated cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { Cart } from '../../models/cart.model';

export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ product: Cart }>()
);

export const updateCartItem = createAction(
  '[Cart] Update Cart item',
  props<{ productId: string; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ productId: string }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCartFromStorage = createAction(
  '[Cart] Load Cart from Storage',
  props<{ cart: Cart[] }>()
);
