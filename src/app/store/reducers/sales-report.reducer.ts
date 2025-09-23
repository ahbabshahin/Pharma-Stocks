import { createReducer, on } from '@ngrx/store';
import { CustomerWiseSalesReport, CustomerWiseSalesReportResponse, DailyReport, ProductReport, SalesReportByPrice, SalesSummaryByArea, SalesSummaryGrandTotal, SalesSummaryReport } from '../models/sales-report.model';
import * as salesReportActions from '../actions/sales-report.action';

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
  salesSummaryByArea: SalesSummaryReport[];
  customerWiseReport: CustomerWiseSalesReport[];
  grandTotals: SalesSummaryGrandTotal;
  customerReportLoader: boolean;
  salesReportLoader: boolean;
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
  salesSummaryByArea: [],
  customerWiseReport: [],
  grandTotals: {
    totalInvoices: 0,
    totalQuantity: 0,
    totalRevenue: 0
  },
  customerReportLoader: false,
  salesReportLoader: false,
  error: '',
};

export const initialState: SalesReportState = defaultSales;

export const salesReportReducer = createReducer(
  initialState,
  on(salesReportActions.loadDailyReport, (state, action) => {
    return {
      ...state,
      date:
        state?.date !== action.params['date']
          ? action.params['date']
          : state?.date,
      dailyReportLoader: true,
    };
  }),
  on(salesReportActions.loadDailyReportSuccess, (state, action) => {
    return {
      ...state,
      dailyReport: action?.res?.body,
      dailyReportLoader: false,
      dailyReportTotalRevenue: action?.res?.total ?? 0,
      dailyReportTotalQuantity: action?.res?.totalQuantity ?? 0,
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
      date:
        state?.date !== action.params['date']
          ? action.params['date']
          : state?.date,
      productReportLoader: true,
    };
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

  // on(salesReportActions.loadSalesSummaryByAllArea, (state, action) => {
  //   return {
  //     ...state,
  //     date: state?.date !== action.params['date'] ? action.params['date'] : state?.date,
  //     productReportLoader: true,
  //   }
  // }),
  // on(salesReportActions.loadSalesSummaryByAllAreaSuccess, (state, action) => {
  //   return {
  //     ...state,
  //     salesSummaryByArea: action.res
  //   };
  // }),
  // on(salesReportActions.loadSalesSummaryByAllAreaFail, (state, action) => {
  //   return {
  //     ...state,
  //     error: action.error
  //   }
  // }),

  // on(salesReportActions.loadCustomerWiseSalesReport, (state, action) => {
  //   return {
  //     ...state,
  //     date:
  //       state?.date !== action.params['date']
  //         ? action.params['date']
  //         : state?.date,
  //     customerReportLoader: true,
  //   };
  // }),
  // on(salesReportActions.loadCustomerWiseSalesReportSuccess, (state, action) => {
  //   return {
  //     ...state,
  //     customerWiseReport: action.res,
  //     customerReportLoader: false,
  //   };
  // }),
  // on(salesReportActions.loadCustomerWiseSalesReportFail, (state, action) => {
  //   return {
  //     ...state,
  //     error: action.error,
  //     customerReportLoader: false,
  //   }
  // }),

  on(salesReportActions.loadSalesReport, (state, action) => {
    return {
      ...state,
      date:
        state?.date !== action.params['date']
          ? action.params['date']
          : state?.date,
      salesReportLoader: true,
    };
  }),
  on(salesReportActions.loadSalesReportSuccess, (state, action) => {
    return {
      ...state,
      productReport: action?.res?.product?.report,
      salesSummaryByArea: action?.res?.area?.report,
      customerWiseReport: action.res?.customer?.report,
      grandTotals: action?.res?.grandTotals,
      salesReportLoader: false,
    };
  }),
  on(salesReportActions.loadSalesReportFail, (state, action) => {
    return {
      ...state,
      error: action.error,
      salesReportLoader: false,
    }
  }),

)
