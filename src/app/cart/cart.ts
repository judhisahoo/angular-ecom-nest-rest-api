import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { Store } from '@ngrx/store';
import {
  selectAllCartItems,
  selectCartGrandTotal,
  selectCartTax,
  selectCartTotalPrice,
} from '../store/cart/cart.selector';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { removeFromCart, updateCartItem } from '../store/cart/cart.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  cartItems$: Observable<Cart[]>;
  subtotal$: Observable<number>;
  tax$: Observable<number>;
  grandTotal$: Observable<number>;

  constructor(private store: Store) {
    this.cartItems$ = this.store.select(selectAllCartItems);
    this.subtotal$ = this.store.select(selectCartTotalPrice);
    this.tax$ = this.store.select(selectCartTax);
    this.grandTotal$ = this.store.select(selectCartGrandTotal);
  }
  ngOnInit(): void {}

  onQuantityChange(item: Cart, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (newQuantity > 0) {
      this.store.dispatch(
        updateCartItem({
          productId: item.productId,
          quantity: newQuantity,
        })
      );
    }
  }

  removeCartItem(productId: string): void {
    this.store.dispatch(removeFromCart({ productId }));
  }
}
