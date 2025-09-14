import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { SalesReportState } from '../../store/reducers/sales-report.reducer';
import * as salesReportActions from '../../store/actions/sales-report.action.action';
import { DailyReport, DailyReportResponse, ProductReport, ProductReportResponse, SalesReportByPrice, SalesReportResponse, SalesSummaryByArea, CustomerWiseSalesReportResponse } from '../../store/models/sales-report.model';
import { Observable } from 'rxjs';
import * as salesReportSelectors from '../../store/selectors/sales-report.selector';

@Injectable({
  providedIn: 'root',
})
export class SalesReportStoreService {
  constructor(private store: Store<SalesReportState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (action: any) => this.store.select(action);

  loadDailyReport(params: { [key: string]: any }) {
    this.dispatch(salesReportActions.loadDailyReport({ params }));
  }
  loadDailyReportSuccess(res: DailyReportResponse) {
    this.dispatch(salesReportActions.loadDailyReportSuccess({ res }));
  }
  loadDailyReportFail(error: string) {
    this.dispatch(salesReportActions.loadDailyReportFail({ error }));
  }

  loadProductReport(params: { [key: string]: any }) {
    this.dispatch(salesReportActions.loadProductReport({ params }));
  }
  loadProductReportSuccess(res: ProductReportResponse) {
    this.dispatch(salesReportActions.loadProductReportSuccess({ res }));
  }
  loadProductReportFail(error: string) {
    this.dispatch(salesReportActions.loadProductReportFail({ error }));
  }

  loadSalesSummaryByAllArea(params: { [key: string]: any }) {
    this.dispatch(salesReportActions.loadSalesSummaryByAllArea({ params }));
  }

  loadCustomerWiseSalesReport(params: { [key: string]: any }) {
    this.dispatch(salesReportActions.loadCustomerWiseSalesReport({ params }));
  }

  getSalesReportDate = (): Observable<string> =>
    this.select(salesReportSelectors.getSalesReportDate);

  getDailyReportLoader = (): Observable<boolean> =>
    this.select(salesReportSelectors.getDailyReportLoader);
  getDailyReportTotalRevenue = (): Observable<number> =>
    this.select(salesReportSelectors.getDailyReportTotalRevenue);
  getDailyReportTotalQuantity = (): Observable<number> =>
    this.select(salesReportSelectors.getDailyReportTotalQuantity);
  getDailyReport = (): Observable<DailyReport[]> =>
    this.select(salesReportSelectors.getDailyReport);

  getProductReportLoader = (): Observable<boolean> =>
    this.select(salesReportSelectors.getProductReportLoader);
  getProductReportTotalRevenue = (): Observable<number> =>
    this.select(salesReportSelectors.getProductReportTotalRevenue);
  getProductReportTotalQuantity = (): Observable<number> =>
    this.select(salesReportSelectors.getProductReportTotalQuantity);
  getProductReport = (): Observable<ProductReport[]> =>
    this.select(salesReportSelectors.getProductReport);

  getSalesSummaryByAllArea = (): Observable<SalesSummaryByArea> =>
    this.select(salesReportSelectors.getSalesSummaryByAllArea);

  getCustomerReportLoader = (): Observable<boolean> =>
    this.select(salesReportSelectors.getCustomerReportLoader);

  getCustomerWiseSalesReport = (): Observable<CustomerWiseSalesReportResponse> =>
    this.select(salesReportSelectors.getCustomerWiseSalesReport);

  getSalesReportError = (): Observable<string> =>
    this.select(salesReportSelectors.getSalesReportError);
}
