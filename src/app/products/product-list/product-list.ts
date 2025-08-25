import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../product-service';
import { LoaderService } from '../../shared/loader.service';
import { Loader } from '../../shared/loader/loader';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { Card } from '../card/card';
import { ProductDataService } from '../product-data.service';

@Component({
  selector: 'app-product-list',
  imports: [Loader, CommonModule, Card],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isProductLoading: boolean = false;
  error: any;

  isLoggedIn$: Observable<boolean>;
  private subscription: Subscription = new Subscription();

  //

  constructor(
    private productService: ProductService,
    public loaderService: LoaderService,
    private router: Router,
    private authService: AuthService,
    private productDataService: ProductDataService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  ngOnInit() {
    console.log('ngOnInit()');
    this.getProducts();

    // Check token validity when component initializes
    this.authService.checkTokenValidity();

    // Optional: Subscribe to auth state changes for debugging
    this.subscription.add(
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        console.log('isLoggedIn in product list ::', isLoggedIn);
      })
    );
    this.authService.redirectURL = this.router.url;
  }

  getProducts() {
    this.isProductLoading = true;
    this.loaderService.show();
    this.productService.getAllProducts().subscribe(
      (productsFromService) => {
        this.isProductLoading = false;
        this.products = productsFromService;
        //console.log('all products at product list ::', this.products);
        //console.log('Product array length ::', this.products.length); // Also check this
        this.loaderService.hide();
      },
      (error) => {
        console.log('error arises', error);
        this.error = error;
        this.loaderService.hide();
        this.isProductLoading = false;
      }
    );
  }

  onEdit(product: Product) {}

  onDelete(product: Product) {
    this.productService.deleteProduct(product.id).subscribe(
      (response) => {
        this.getProducts();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onShow(product: Product) {
    // Store the product object in the service
    this.productDataService.setProduct(product);
    this.router.navigate(['/product-details']);
  }
}
