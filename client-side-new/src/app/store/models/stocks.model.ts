export interface Stock {
  _id: string;
  productName: string;
  productQuantity: string;
  productPrice: string;
  brand: string;
  productDosage: string;
  lowStockThreshold: number;
  isLowStock?: boolean;
}
