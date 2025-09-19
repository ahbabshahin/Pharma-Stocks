export interface CustomerSummary {
  totalQuantity: number;
  customerId: string;
  customerName: string;
  areaCode: string;
  totalRevenue: number;
}

export interface CustomerSummaryResponse {
  customers: CustomerSummary[];
  total: number;
  period: SummaryPeriod;
  periodType: string;
}

export interface SummaryPeriod {
  start: string;
  end: string;
}
