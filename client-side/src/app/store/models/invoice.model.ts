export interface Invoice {
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
