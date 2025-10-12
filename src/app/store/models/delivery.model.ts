export interface Delivery {
  _id: string;
  name: string;
  totalAmount: number;
}

export interface DeliveryResponse {
  date: string;
  areaCode: string;
  body: Delivery[];
  grandTotal: number;
}
