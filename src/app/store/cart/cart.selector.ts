import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');
//export const selectCartState = (state: { cart: CartState }) => state.cart;

export const selectAllCartItems = createSelector(
  selectCartState,
  (state: CartState | undefined) => state?.cart || []
);

export const selectCartTotalQuantity = createSelector(
  selectAllCartItems,
  (cart) => cart.reduce((total, item) => total + item.prodQuantity, 0)
);

export const selectCartTotalPrice = createSelector(selectAllCartItems, (cart) =>
  cart.reduce((total, item) => total + item.prodQuantity * item.prodPrice, 0)
);

const TAX_RATE = 0.08; // 8% tax rate
export const selectCartTax = createSelector(
  selectCartTotalPrice,
  (total) => total * TAX_RATE
);

export const selectCartGrandTotal = createSelector(
  selectCartTotalPrice,
  selectCartTax,
  (total, tax) => total + tax
);
