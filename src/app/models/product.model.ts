export interface Product {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  qty?: never;
  upc?: string;
  category?: string;
  image?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
