import { ActivityLog } from "./common.model";

export interface Stock {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  brand: string;
  dosage: string;
  lowStockThreshold: number;
  isLowStock?: boolean;
  activity_log?: ActivityLog[];
}
