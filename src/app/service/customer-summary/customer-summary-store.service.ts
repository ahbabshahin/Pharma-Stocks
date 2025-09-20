import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CustomerSummaryState } from '../../store/reducers/customer-summary.reducer';
import { Observable } from 'rxjs';
import { CustomerSummary } from '../../store/models/sold-products.model';
import * as customerSummaryActions from '../../store/actions/customer-summary.actions';
import * as customerSummarySelectors from '../../store/selectors/customer-summary.selector';

@Injectable()
export class CustomerSummaryStoreService {
  constructor(private store: Store<CustomerSummaryState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (selector: any) => this.store.select(selector);

  loadCustomerSummaryList(params: { [key: string]: any }, isMore: boolean) {
    this.dispatch(customerSummaryActions.loadCustomerSummaryList({ params, isMore }));
  }

  getCustomerSummaryLoader = (): Observable<boolean> =>
    this.select(customerSummarySelectors.getCustomerSummaryLoader);

  getCustomerSummarySubLoader = (): Observable<boolean> =>
    this.select(customerSummarySelectors.getCustomerSummarySubLoader);

  getCustomerSummaryLoaded = (): Observable<boolean> =>
    this.select(customerSummarySelectors.getCustomerSummaryLoaded);

  getTotalCustomerSummary = (): Observable<number> =>
    this.select(customerSummarySelectors.getTotalCustomerSummary);

  getCustomerSummaryList = (): Observable<CustomerSummary[]> =>
    this.select(customerSummarySelectors.getCustomerSummaryList);
}
