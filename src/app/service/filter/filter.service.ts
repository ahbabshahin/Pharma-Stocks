import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { FilterState } from '../../store/reducers/filter.reducer';
import {
  PaymentStatus,
  SalesReportPeriod,
} from '../../store/models/common.model';
import * as filterActions from '../../store/actions/filter.action';
import { Observable } from 'rxjs';
import * as filterSelectors from '../../store/selectors/filter.selector';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private datePipe: DatePipe, private store: Store<FilterState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (selector: any) => this.store.select(selector);

  formatSelectedDate(selectedDate: Date): string {
    let formattedDate: string =
      this.datePipe.transform(selectedDate, 'yyyy-MM-01') || '';
    return formattedDate;
  }

  setFilterStatus(status: PaymentStatus) {
    this.dispatch(filterActions.setFilterStatus({ status }));
  }

  setFilterDate(date: string) {
    this.dispatch(filterActions.setFilterDate({ date }));
  }

  setFilterPeriod(period: SalesReportPeriod) {
    this.dispatch(filterActions.setFilterPeriod({ period }));
  }

  getFilterStatus = (): Observable<PaymentStatus> =>
    this.select(filterSelectors.getFilterStatus);

  getFilterDate = (): Observable<string> =>
    this.select(filterSelectors.getFilterDate);

  getFilterPeriod = (): Observable<SalesReportPeriod> =>
    this.select(filterSelectors.getFilterPeriod);
}
