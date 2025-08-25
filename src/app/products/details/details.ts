import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductDataService } from '../product-data.service';
import { Observable, Subscription, take } from 'rxjs';
import { AuthService } from '../../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllCartItems } from '../../store/cart/cart.selector';
import { Cart } from '../../models/cart.model';
import { updateCartItem, addToCart } from '../../store/cart/cart.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit, OnDestroy {
  //Id: string | null = '';
  product: Product | null = null;
  qtyerr: string = '';
  prodqty: number = 1;
  //qty: number = 1;
  //

  isLoggedIn$: Observable<boolean>;
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  //constructor(private route: ActivatedRoute,) {
  constructor(
    private productDataService: ProductDataService,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
    /*this.route.params.subscribe((params) => {
      this.id = params['id'];
    });*/
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  ngOnInit(): void {
    //this.Id = this.route.snapshot.paramMap.get('id');
    //console.log('this.Id ::', this.Id);

    // Retrieve the product data from the service
    this.product = this.productDataService.getProduct();
    console.log('this.product ::', this.product);

    if (!this.product) {
      // Handle the case where no product data was found (e.g., direct URL access)
      // You could redirect back to the product list or show an error message.
      console.log('No product data found. Redirecting to product list...');
      this.router.navigate(['/products/list']);
    }

    this.subscription.add(
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        console.log('isLoggedIn in product details ::', isLoggedIn);
      })
    );

    console.log('isLoggedIn in product details ::', this.isLoggedIn);
    console.log('isLoggedIn$ in product details ::', this.isLoggedIn$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login4Cart() {
    this.authService.redirectURL = this.router.url;
    console.log('now to calling login4Cart()');
    this.router.navigate(['/login']);
  }

  addToCart() {
    console.log('this.prodqty ::', this.prodqty);
    if (this.prodqty <= 0) {
      this.qtyerr = 'Quantity must be greater than 0';
      return;
    } else {
      this.qtyerr = '';
    }
    console.log('this.product ::', this.product);

    // Handle the case where the product is null at the beginning
    if (!this.product) {
      console.log('Product data is not available.');
      this.router.navigate(['/products/list']);
      return;
    }

    // Create a local constant for the product to ensure its type is 'Product' and not 'Product | null'
    const product = this.product;
    console.log('const product ::', product);

    // Validate required product fields
    if (
      !product._id ||
      !product.name ||
      !product.image ||
      product.price === undefined
    ) {
      console.error('Product is missing required fields');
      return;
    }

    // Get the current user and cart state from the store
    this.store
      .select(selectCurrentUser)
      .pipe(
        take(1) // take(1) ensures we only get the latest value and then unsubscribe
      )
      .subscribe((user) => {
        if (!user || !user._id) {
          console.error('User not logged in or user ID not available');
          this.login4Cart();
          return;
        }

        this.store
          .select(selectAllCartItems)
          .pipe(take(1))
          .subscribe((cartItems) => {
            // Use non-null assertion operator (!) or provide defaults
            const productId = product._id!; // We validated this above

            const existingItem = cartItems.find(
              (item) => item.productId === productId
            );

            console.log('existing item in cart:', existingItem);
            if (existingItem) {
              // Update existing cart item quantity
              this.store.dispatch(
                updateCartItem({
                  productId: productId,
                  quantity: existingItem.prodQuantity + this.prodqty,
                })
              );
            } else {
              // Create new cart item with proper type checking
              /*const newCartItem: Cart = {
                _id: '', // Will be set by the backend/store
                id: '', // Will be set by the backend/store
                productId: productId,
                prodQuantity: this.prodqty,
                userId: user._id || '', // We validated this above
                prodPrice: product.price || 0, // We validated this above
                prodName: product.name || 'Unknown Product', // We validated this above
                prodImage:
                  product.image ||
                  'https://randomuser.me/api/portraits/men/2.jpg', // We validated this above
              };*/

              const newCartItem: Cart = {
                _id: '', // Will be set by the backend/store
                id: '', // Will be set by the backend/store
                productId: productId,
                prodQuantity: this.prodqty,
                userId: user._id!, // We validated this above
                prodPrice: product.price!, // We validated this above
                prodName: product.name!, // We validated this above
                prodImage: product.image!, // We validated this above
              };

              console.log('New cart item:', newCartItem);

              // Dispatch the action to add the item to cart
              this.store.dispatch(addToCart({ product: newCartItem }));
              console.log('Added new item to cart');
            }
          });
      });
  }

  backToList() {
    this.router.navigate(['/products/list']);
  }
}
