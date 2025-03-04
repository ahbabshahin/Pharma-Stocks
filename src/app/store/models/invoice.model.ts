import { ActivityLog } from "./common.model";

export interface Invoice {
  _id?: string;
  sn:string;
  user?: string;
  products: Product[];
  discount: number;
  totalAmount: number;
  status: string;
  customer: string;
  createdAt?: string;
  activity_log?: ActivityLog[];
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
  _id: string;
}
