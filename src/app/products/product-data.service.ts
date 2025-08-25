import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  constructor() {
    console.log('Product Data Service');
  }

  private selectedProduct: Product | null = null;

  setProduct(product: Product) {
    this.selectedProduct = product;
  }

  getProduct(): Product | null {
    return this.selectedProduct;
  }
}
