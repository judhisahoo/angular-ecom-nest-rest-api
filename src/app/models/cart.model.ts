export interface Cart {
  _id: string;
  id: string;
  productId: string;
  prodQuantity: number;
  prodPrice: number;
  prodName: string;
  prodImage: string;
  userId: string;
}

// Alternative: Create a separate interface for cart creation
export interface CreateCartItem {
  _id?: string;
  id?: string;
  productId: string;
  prodQuantity: number;
  prodPrice: number;
  prodName: string;
  prodImage: string;
  userId: string;
}
