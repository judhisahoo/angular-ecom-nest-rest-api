import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateCartItem,
} from './cart.actions';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectCartState } from './cart.selector';
import {
  removeLocalStorageItem,
  setLocalStorageWithExpiration,
} from '../../../lib/helper/storage';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  saveCartToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addToCart, removeFromCart, clearCart, updateCartItem),
        withLatestFrom(this.store.select(selectCartState)),
        tap(([action, cartState]) => {
          console.log('Cart action dispatched:', action.type);

          try {
            if (cartState && cartState.cart) {
              setLocalStorageWithExpiration('cart', cartState.cart, 1);
              console.log('Cart saved to localStorage:', cartState.cart);
            } else {
              removeLocalStorageItem('cart');
              console.log('Empty cart saved to localStorage');
            }
          } catch (error) {
            console.error('Error saving cart to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );
}
