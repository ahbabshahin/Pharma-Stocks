import { ActivityLog } from "./common.model";

export interface Invoice<T> {
  _id?: string;
  sn:string;
  user?: string;
  products: Product[];
  discount: number;
  totalAmount: number;
  status: string;
  customer: T;
  createdAt?: string;
  activity_log?: ActivityLog[];
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
  tp: number;
  vat: number;
  bonus: number;
  _id: string;
  total?: number;
}
