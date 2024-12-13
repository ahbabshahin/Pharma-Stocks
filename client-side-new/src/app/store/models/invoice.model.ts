export interface Invoice {
  _id?: string;
  user?: string;
  products: Product[];
  taxRate: number;
  totalAmount: number;
  status: string;
  customer: string;
}

export interface Product {
  name: String;
  quantity: number;
  price: number;
}
