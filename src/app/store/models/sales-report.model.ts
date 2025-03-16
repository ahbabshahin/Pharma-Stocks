export interface SalesReportByPrice {
  product: string;
  price: number;
  totalQuantity: number;
  totalRevenue: number;
  month: string;
  year: number;
}

export interface DailyReport {
  totalInvoices: number;
  date: string;
  totalRevenue: number;
  averageInvoiceValue: number;
}
