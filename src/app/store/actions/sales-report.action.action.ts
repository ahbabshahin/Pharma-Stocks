import { createAction, props } from "@ngrx/store";
import { DailyReportResponse, ProductReportResponse, SalesReportResponse } from "../models/sales-report.model";

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
  props<{ date: string }>()
);
export const loadProductReportSuccess = createAction(
  '[Sales Report: Product Report] load product report success',
  props<{ res: ProductReportResponse }>()
);
export const loadProductReportFail = createAction(
  '[Sales Report: Product Report] load product report fail',
  props<{ error: string }>()
);
