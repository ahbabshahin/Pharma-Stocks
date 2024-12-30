import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CustomerState } from '../../store/reducers/customer.reducer';
import { Observable } from 'rxjs';
import * as customerActions from '../../store/actions/customer.action';
import { Update } from '@ngrx/entity';
import { Customer } from '../../store/models/customer.model';
import * as customerSelectors from '../../store/selectors/customer.selector';

@Injectable()
export class CustomerStoreService {
  constructor(private store: Store<CustomerState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = <T>(action: any): Observable<T> => this.store.select(action);

  // Set Sub Loader
  setCustomerSubLoader(status: boolean) {
    this.dispatch(customerActions.setCustomerSubLoader({ status }));
  }

  // Load Customers
  loadCustomer(params: { [key: string]: any }) {
    this.dispatch(customerActions.loadCustomer({ params }));
  }
  loadCustomerSuccess(res: Customer[]) {
    this.dispatch(customerActions.loadCustomerSuccess({ res }));
  }
  loadCustomerFail(error: string) {
    this.dispatch(customerActions.loadCustomerFail({ error }));
  }

  // Add Customer
  addCustomer(payload: Customer) {
    this.dispatch(customerActions.addCustomer({ payload }));
  }
  addCustomerSuccess(res: Customer) {
    this.dispatch(customerActions.addCustomerSuccess({ res }));
  }
  addCustomerFail(error: string) {
    this.dispatch(customerActions.addCustomerFail({ error }));
  }

  // Update Customer
  updateCustomer(payload: Customer) {
    this.dispatch(customerActions.updateCustomer({ payload }));
  }
  updateCustomerSuccess(res: Update<Customer>) {
    this.dispatch(customerActions.updateCustomerSuccess({ res }));
  }
  updateCustomerFail(error: string) {
    this.dispatch(customerActions.updateCustomerFail({ error }));
  }

  // Delete Customer
  deleteCustomer(id: string) {
    this.dispatch(customerActions.deleteCustomer({ id }));
  }
  deleteCustomerSuccess(id: string) {
    this.dispatch(customerActions.deleteCustomerSuccess({ id }));
  }
  deleteCustomerFail(error: string) {
    this.dispatch(customerActions.deleteCustomerFail({ error }));
  }

  // Search Customer
  searchCustomer(params: { [key: string]: any }) {
    this.dispatch(customerActions.searchCustomer({ params }));
  }
  searchCustomerSuccess(res: Customer[]) {
    this.dispatch(customerActions.searchCustomerSuccess({ res }));
  }
  searchCustomerFail(error: string) {
    this.dispatch(customerActions.searchCustomerFail({ error }));
  }

  //selectors

  getCustomerLoader = (): Observable<boolean> =>
    this.select(customerSelectors.getCustomerLoader);

  getCustomerSubLoader = (): Observable<boolean> =>
    this.select(customerSelectors.getCustomerSubLoader);

  getCustomerLoaded = (): Observable<boolean> =>
    this.select(customerSelectors.getCustomerLoaded);

  getCustomerError = (): Observable<string> =>
    this.select(customerSelectors.getCustomerError);

  getCustomers = (): Observable<Customer[]> =>
    this.select(customerSelectors.getCustomers);
}