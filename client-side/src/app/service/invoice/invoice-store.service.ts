import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { InvoiceState } from '../../store/reducers/invoice.reducer';
import * as invoiceActions from '../../store/actions/invoice.action';
import * as invoiceSelectors from '../../store/selectors/invoice.selector';
import { Invoice } from '../../store/models/invoice.model';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InvoiceStoreService {
  constructor(private store: Store<InvoiceState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = <T>(action: any): Observable<T> => this.store.select(action);

  setLoader(status: boolean) {
    console.log('status: ', status);
    this.dispatch(invoiceActions.setLoader({ status }));
  }
  setSubLoader(status: boolean) {
    this.dispatch(invoiceActions.setSubLoader({ status }));
  }

  loadInvoice(params: { [key: string]: any }) {
    this.dispatch(invoiceActions.loadInvoice({ params }));
  }
  loadInvoiceSuccess(res: Invoice[], total: number) {
    this.dispatch(invoiceActions.loadInvoiceSuccess({ res, total }));
  }
  loadInvoiceFail(error: string) {
    this.dispatch(invoiceActions.loadInvoiceFail({ error }));
  }

  addInvoice(payload: Invoice) {
    this.dispatch(invoiceActions.addInvoice({ payload }));
  }
  addInvoiceSuccess(res: Invoice) {
    this.dispatch(invoiceActions.addInvoiceSuccess({ res }));
  }
  addInvoiceFail(error: string) {
    this.dispatch(invoiceActions.addInvoiceFail({ error }));
  }

  updateInvoice(payload: Invoice) {
    this.dispatch(invoiceActions.updateInvoice({ payload }));
  }
  updateInvoiceSuccess(res: Update<Invoice>) {
    this.dispatch(invoiceActions.updateInvoiceSuccess({ res }));
  }
  updateInvoiceFail(error: string) {
    this.dispatch(invoiceActions.updateInvoiceFail({ error }));
  }

  deleteInvoice(_id: string) {
    this.dispatch(invoiceActions.deleteInvoice({ _id }));
  }
  deleteInvoiceSuccess(_id: string) {
    this.dispatch(invoiceActions.deleteInvoiceSuccess({ _id }));
  }
  deleteInvoiceFail(error: string) {
    this.dispatch(invoiceActions.deleteInvoiceFail({ error }));
  }

  // selectors

  getInvoiceLoader = (): Observable<boolean> =>
    this.select(invoiceSelectors.getInvoiceLoader);
  getInvoiceSubLoader = (): Observable<boolean> =>
    this.select(invoiceSelectors.getInvoiceSubLoader);
  getInvoiceLoaded = (): Observable<boolean> =>
    this.select(invoiceSelectors.getInvoiceLoaded);
  getInvoiceError = (): Observable<boolean> =>
    this.select(invoiceSelectors.getInvoiceError);
  getInvoices = (): Observable<Invoice[]> =>
    this.select(invoiceSelectors.getInvoices);
}
