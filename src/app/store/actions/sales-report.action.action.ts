import { createAction, props } from "@ngrx/store";
import { DailyReportResponse, ProductReportResponse, SalesReportResponse, SalesSummaryByArea } from "../models/sales-report.model";

export const loadDailyReport = createAction(
  '[Sales Report: Daily Report] load daily report',
  props<{ params: { [key: string]: any } }>()
);
export const loadDailyReportSuccess = createAction(
  '[Sales Report: Daily Report] load daily report success',
  props<{ res: DailyReportResponse }>()
);
export const loadDailyReportFail = createAction(
  '[Sales Report: Daily Report] load daily report fail',
  props<{ error: string }>()
);

export const loadProductReport = createAction(
  '[Sales Report: Product Report] load product report',
  props<{ params: { [key: string]: any } }>()
);
export const loadProductReportSuccess = createAction(
  '[Sales Report: Product Report] load product report success',
  props<{ res: ProductReportResponse }>()
);
export const loadProductReportFail = createAction(
  '[Sales Report: Product Report] load product report fail',
  props<{ error: string }>()
);

export const loadSalesSummaryByAllArea = createAction(
  '[Sales Report: Product Report] Sales Summary By All Area',
  props<{ params: { [key: string]: any } }>()
);
export const loadSalesSummaryByAllAreaSuccess = createAction(
  '[Sales Report: Product Report] Sales Summary By All Area success',
  props<{ res: SalesSummaryByArea }>()
);
export const loadSalesSummaryByAllAreaFail = createAction(
  '[Sales Report: Product Report] Sales Summary By All Area fail',
  props<{ error: string }>()
);
