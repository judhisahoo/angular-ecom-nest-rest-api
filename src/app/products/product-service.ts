import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { api } from '../../lib/api/api';
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  getAllProducts(): Observable<Product[]> {
    return new Observable((observer) => {
      api.products
        .getAll()
        .then((response) => {
          observer.next(response.data.products);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  deleteProduct(id: any): Observable<any> {
    return new Observable((observer) => {
      api.products.delete(id).then((response) => {
        observer.next(response.data);
      });
    });
  }

  geDetails(product: Product): void {
    console.log('Product: ', product);
  }
}
