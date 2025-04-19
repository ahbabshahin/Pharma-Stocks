import { createReducer } from '@ngrx/store';
import { DailyReport, SalesReportByPrice } from '../models/sales-report.model';

export interface SalesReportState  {
  date: string;
  dailyReportLoader: boolean;
  dailyReport: DailyReport[];
  productReportLoader: boolean;
  productReport: SalesReportByPrice[];
  error: string;
}

const defaultSales: SalesReportState = {
  date: '',
  dailyReportLoader: false,
  dailyReport: [],
  productReportLoader: false,
  productReport: [],
  error: '',
};

export const initialState: SalesReportState = defaultSales;

export const salesReportReducer = createReducer(
  initialState,
)
