import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { getLocalStorageWithExpiration } from '../lib/helper/storage';
import { loadCartFromStorage } from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  //private readonly pageTitle = signal('Home page for Dynamic tutle');
  public title = 'angular-ecom-nest-JS';
  constructor(private titleService: Title, private store: Store) {}

  ngOnInit(): void {
    this.titleService.setTitle('Home page for Dynamic tutle');
    this.initializeCartFromStorage();
  }

  private initializeCartFromStorage() {
    try {
      const savedCart = getLocalStorageWithExpiration('cart');
      if (savedCart) {
        const cartData = savedCart;
        this.store.dispatch(loadCartFromStorage({ cart: cartData }));
        console.log('Cart loaded from localStorage:', cartData);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
}
