// cart.service.ts - Alternative approach without effects
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToCart,
  removeFromCart,
  clearCart,
  loadCartFromStorage,
} from '../store/cart/cart.actions'; //'./store/cart/cart.actions';
import {
  selectAllCartItems,
  selectCartState,
} from '../store/cart/cart.selector';
import { Cart } from '../models/cart.model'; //'./models/cart.model';
import {
  getLocalStorageWithExpiration,
  removeLocalStorageItem,
  setLocalStorageWithExpiration,
} from '../../lib/helper/storage';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private store: Store) {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();

    // Subscribe to cart changes to save to localStorage
    this.store.select(selectCartState).subscribe((cartState) => {
      if (cartState && cartState.cart) {
        //localStorage.setItem('cart', JSON.stringify(cartState.cart));
        setLocalStorageWithExpiration('cart', cartState.cart, 1);
      } else {
        //localStorage.removeItem('cart');
        removeLocalStorageItem('cart');
      }
    });
  }

  private loadCartFromStorage() {
    try {
      const savedCart = getLocalStorageWithExpiration('cart'); //localStorage.getItem('cart');
      if (savedCart) {
        const cartData = savedCart; //JSON.parse(savedCart);
        // You would need to create a loadCartFromStorage action
        //this.store.dispatch(loadCartFromStorage({ cart: cartData }));
        this.store.dispatch(loadCartFromStorage({ cart: cartData }));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }

  addToCart(product: Cart) {
    this.store.dispatch(addToCart({ product }));
  }

  removeFromCart(productId: string) {
    this.store.dispatch(removeFromCart({ productId }));
  }

  clearCart() {
    this.store.dispatch(clearCart());
  }

  getCartItems() {
    return this.store.select(selectAllCartItems);
  }
}
