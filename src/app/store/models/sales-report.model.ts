export interface SalesReportByPrice {
  product: string;
  price: number;
  totalQuantity: number;
  totalRevenue: number;
  month: string;
  year: number;
}
export interface SalesReportByQuantity {
  product: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface DailyReport {
  totalInvoices: number;
  date: string;
  totalRevenue: number;
  averageInvoiceValue: number;
  totalQuantity: number;
}

export interface DailyReportResponse {
  body: DailyReport[];
  total: number;
  totalQuantity: number;
}
