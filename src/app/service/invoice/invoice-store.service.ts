import { Injectable, Signal } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import * as invoiceActions from '../../store/actions/invoice.action';
import * as invoiceSelectors from '../../store/selectors/invoice.selector';
import { Invoice } from '../../store/models/invoice.model';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { InvoiceState } from '../../store/reducers/invoice.reducer';
import { Customer } from 'src/app/store/models/customer.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { AreaCode } from 'src/app/store/models/area-code.model';
@Injectable()
export class InvoiceStoreService {
  constructor(private store: Store<InvoiceState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = <T>(action: any): Observable<T> => this.store.select(action);

  setLoader(status: boolean) {
    this.dispatch(invoiceActions.setLoader({ status }));
  }
  setInvoiceLoaded(status: boolean) {
    this.dispatch(invoiceActions.setInvoiceLoaded({ status }));
  }
  setSubLoader(status: boolean) {
    this.dispatch(invoiceActions.setSubLoader({ status }));
  }

  loadInvoice(params: { [key: string]: any }, isMore: boolean) {
    this.dispatch(invoiceActions.loadInvoice({ params, isMore }));
  }
  loadInvoiceSuccess(res: Invoice<Customer<AreaCode>>[], total: number, isMore: boolean) {
    this.dispatch(invoiceActions.loadInvoiceSuccess({ res, total, isMore }));
  }
  loadInvoiceFail(error: string) {
    this.dispatch(invoiceActions.loadInvoiceFail({ error }));
  }

  addInvoice(payload: Invoice<string>) {
    this.dispatch(invoiceActions.addInvoice({ payload }));
  }
  addInvoiceSuccess(res: Invoice<Customer<AreaCode>>) {
    this.dispatch(invoiceActions.addInvoiceSuccess({ res }));
  }
  addInvoiceFail(error: string) {
    this.dispatch(invoiceActions.addInvoiceFail({ error }));
  }

  updateInvoice(payload: Invoice<string>) {
    this.dispatch(invoiceActions.updateInvoice({ payload }));
  }
  updateInvoiceSuccess(res: Update<Invoice<Customer<AreaCode>>>) {
    this.dispatch(invoiceActions.updateInvoiceSuccess({ res }));
  }
  updateInvoiceFail(error: string) {
    this.dispatch(invoiceActions.updateInvoiceFail({ error }));
  }

  deleteInvoice(id: string) {
    this.dispatch(invoiceActions.deleteInvoice({ id }));
  }
  deleteInvoiceSuccess(id: string) {
    this.dispatch(invoiceActions.deleteInvoiceSuccess({ id }));
  }
  deleteInvoiceFail(error: string) {
    this.dispatch(invoiceActions.deleteInvoiceFail({ error }));
  }

  searchInvoice(params: { [key: string]: any }, isMore: boolean) {
    this.dispatch(invoiceActions.searchInvoice({ params, isMore }));
  }

  // selectors

  getInvoiceLoader: Signal<boolean> =
    this.store.selectSignal(invoiceSelectors.getInvoiceLoader);
  getInvoiceSubLoader: Signal<boolean> =
    this.store.selectSignal(invoiceSelectors.getInvoiceSubLoader);
  getInvoiceLoaded : Signal<boolean> =
    this.store.selectSignal(invoiceSelectors.getInvoiceLoaded);

  getInvoiceError = (): Observable<boolean> =>
    this.select(invoiceSelectors.getInvoiceError);
  getTotalInvoice = (): Observable<number> =>
    this.select(invoiceSelectors.getTotalInvoice);
  getInvoices = (): Observable<Invoice<Customer<AreaCode>>[]> =>
    this.select(invoiceSelectors.getInvoices);

  getInvoiceById = (id: string): Observable<Invoice<Customer<AreaCode>>> =>
	this.select(invoiceSelectors.getInvoiceById(id))

  invoices = this.store.selectSignal(invoiceSelectors.getInvoices);
  totalInvoice = this.store.selectSignal(invoiceSelectors.getTotalInvoice);

}
