import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SalesReportState } from "../reducers/sales-report.reducer";
import { salesReportStateName } from "../app.state";

export const getSalesReportState = createFeatureSelector<SalesReportState>(salesReportStateName);

export const getSalesReportDate = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.date
)

export const getDailyReportLoader = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.dailyReportLoader
);

export const getDailyReportTotalRevenue = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.dailyReportTotalRevenue
);

export const getDailyReportTotalQuantity = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.dailyReportTotalQuantity
);

export const getDailyReport = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.dailyReport
);

// product report
export const getProductReportLoader = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.productReportLoader
);

export const getProductReportTotalRevenue = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.productReportTotalRevenue
);

export const getProductReportTotalQuantity = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.productReportTotalQuantity
);

export const getProductReport = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.productReport
);

export const getSalesSummaryByAllArea = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.salesSummaryByArea
);

export const getCustomerReportLoader = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.customerReportLoader
);

export const getCustomerWiseSalesReport = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.customerWiseReport
);

export const getSalesReportError = createSelector(
  getSalesReportState,
  (state: SalesReportState) => state.error
);
