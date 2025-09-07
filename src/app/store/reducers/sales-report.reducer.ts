import { createReducer, on } from '@ngrx/store';
import { DailyReport, ProductReport, SalesReportByPrice, SalesSummaryByArea } from '../models/sales-report.model';
import * as salesReportActions from '../../store/actions/sales-report.action.action';

export interface SalesReportState {
  date: string;
  dailyReportLoader: boolean;
  dailyReport: DailyReport[];
  dailyReportTotalRevenue: number;
  dailyReportTotalQuantity: number;
  productReportLoader: boolean;
  productReport: ProductReport[];
  productReportTotalRevenue: number;
  productReportTotalQuantity: number;
  salesSummaryByArea: SalesSummaryByArea;
  error: string;
}

const defaultSales: SalesReportState = {
  date: '',
  dailyReportLoader: false,
  dailyReportTotalRevenue: 0,
  dailyReportTotalQuantity: 0,
  dailyReport: [],
  productReportLoader: false,
  productReport: [],
  productReportTotalRevenue: 0,
  productReportTotalQuantity: 0,
  salesSummaryByArea: {
    month: '',
    year: 0,
    report: [],
    grandTotals: {
      totalInvoices: 0,
      totalQuantity: 0,
      totalRevenue: 0
    }
  },
  error: '',
};

export const initialState: SalesReportState = defaultSales;

export const salesReportReducer = createReducer(
  initialState,
  on(salesReportActions.loadDailyReport, (state, action) => {
    return {
      ...state,
      date: action.params['date'],
      dailyReportLoader: true,
    }
  }),
  on(salesReportActions.loadDailyReportSuccess, (state, action) => {
    return {
      ...state,
      dailyReport: action?.res?.body,
      dailyReportLoader: false,
      dailyReportTotalRevenue: action?.res?.total,
      dailyReportTotalQuantity: action?.res?.totalQuantity
    };
  }),
  on(salesReportActions.loadDailyReportFail, (state, action) => {
    return {
      ...state,
      dailyReportLoader: false,
      error: action.error
    }
  }),
  on(salesReportActions.loadProductReport, (state, action) => {
    return {
      ...state,
      date: action.params['date'],
      productReportLoader: true,
    }
  }),
  on(salesReportActions.loadProductReportSuccess, (state, action) => {
    return {
      ...state,
      productReport: action?.res?.body,
      productReportLoader: false,
      productReportTotalRevenue: action?.res?.total,
      productReportTotalQuantity: action?.res?.totalQuantity
    };
  }),
  on(salesReportActions.loadProductReportFail, (state, action) => {
    return {
      ...state,
      productReportLoader: false,
      error: action.error
    }
  }),

  on(salesReportActions.loadSalesSummaryByAllArea, (state, action) => {
    return {
      ...state,
      date: action.params['date'],
      productReportLoader: true,
    }
  }),
  on(salesReportActions.loadSalesSummaryByAllAreaSuccess, (state, action) => {
    return {
      ...state,
      salesSummaryByArea: action.res
    };
  }),
  on(salesReportActions.loadSalesSummaryByAllAreaFail, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),

)
