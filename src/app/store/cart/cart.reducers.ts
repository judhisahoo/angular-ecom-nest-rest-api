// Updated cart.reducers.ts
import { createReducer, on } from '@ngrx/store';
import { initialCartState } from './cart.state';
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateCartItem,
  loadCartFromStorage,
} from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  on(loadCartFromStorage, (state, { cart }) => ({
    ...state,
    cart: cart || [],
  })),
  on(addToCart, (state, { product }) => {
    // Check if the product is already in the cart
    const existingProduct = state.cart.find(
      (p) => p.productId === product.productId
    );

    if (existingProduct) {
      // If the product is already in the cart, update its quantity
      const updateCart = state.cart.map((p) =>
        p.productId === product.productId
          ? { ...p, prodQuantity: p.prodQuantity + product.prodQuantity }
          : p
      );
      return {
        ...state,
        cart: updateCart,
      };
    } else {
      // If the product is not in the cart, add it
      return {
        ...state,
        cart: [...state.cart, product],
      };
    }
  }),
  on(updateCartItem, (state, { productId, quantity }) => {
    // This action specifically updates the quantity of an existing product.
    const updateCart = state.cart.map((p) =>
      p.productId === productId ? { ...p, prodQuantity: quantity } : p
    );
    return {
      ...state,
      cart: updateCart,
    };
  }),
  on(removeFromCart, (state, { productId }) => {
    return {
      ...state,
      cart: state.cart.filter((p) => p.productId !== productId),
    };
  }),
  on(clearCart, (state) => {
    return {
      ...state,
      cart: [],
    };
  })
);
