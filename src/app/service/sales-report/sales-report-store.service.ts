import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { SalesReportState } from '../../store/reducers/sales-report.reducer';
import * as salesReportActions from '../../store/actions/sales-report.action.action';
import { DailyReportResponse, SalesReportResponse } from '../../store/models/sales-report.model';

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

  loadProductReport(date: string) {
    this.dispatch(salesReportActions.loadProductReport({ date }));
  }
  loadProductReportSuccess(res: SalesReportResponse) {
    this.dispatch(salesReportActions.loadProductReportSuccess({ res }));
  }
  loadProductReportFail(error: string) {
    this.dispatch(salesReportActions.loadProductReportFail({ error }));
  }
}
