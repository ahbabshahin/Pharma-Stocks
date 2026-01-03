export interface ActivityLog {
  user: string;
  name: string;
  action: string;
  when: Date;
  description: string;
}

interface DataSets {
    label: string;
    data: number[];
  };

export interface BarGraph {
  labels: string[];
  indexAxis: string;
  datasets: DataSets;
}
export interface LineGraph {
  labels: string[];
  xTitle: string;
  yTitle: string;
  datasets: DataSets;
}

export interface PieGraph {
  labels: string[];
  datasets: DataSets;
  backgroundColor: string[];
}

export enum PaymentStatus {
  // ALL = 'all',
  PAID = 'paid',
  DUE = 'due',
}

export enum SalesReportPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}
