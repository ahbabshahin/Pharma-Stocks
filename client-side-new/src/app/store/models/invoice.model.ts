export interface Invoice {
  _id?: string;
  user?: string;
  products: Product[];
  discount: number;
  totalAmount: number;
  status: string;
  customer: string;
}

export interface Product {
  name: String;
  quantity: number;
  price: number;
  _id: string;
}
