import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Invoice } from '../models/invoice.model';
import { createReducer, on } from '@ngrx/store';
import * as invoiceActions from '../../store/actions/invoice.action';

export interface InvoiceState extends EntityState<Invoice> {
  loader: boolean;
  subLoader: boolean;
  loaded: boolean;
  error: string;
}

export const defaultInvoiceState: InvoiceState = {
  ids: [],
  entities: {},
  loader: false,
  subLoader: false,
  loaded: false,
  error: '',
};

export const invoiceAdapter: EntityAdapter<Invoice> =
  createEntityAdapter<Invoice>({
    selectId: (invoice: Invoice) => invoice._id,
  });
export const initialState: InvoiceState =
  invoiceAdapter.getInitialState(defaultInvoiceState);

const { selectAll } = invoiceAdapter.getSelectors();

export const invoiceReducer = createReducer(
  initialState,

  // Set Loader
  on(invoiceActions.setLoader, (state, { status }) => {
    console.log('reducer status ', status);
    return {
    ...state,
    loader: status,
  }}),

  // Set SubLoader
  on(invoiceActions.setSubLoader, (state, { status }) => ({
    ...state,
    subLoader: status,
  })),

  // Load Invoices
  on(invoiceActions.loadInvoice, (state) => ({
    ...state,
    loader: true,
    error: '',
  })),
  on(invoiceActions.loadInvoiceSuccess, (state, { res }) =>
    invoiceAdapter.setAll(res, {
      ...state,
      loader: false,
      loaded: true,
    })
  ),
  on(invoiceActions.loadInvoiceFail, (state, { error }) => ({
    ...state,
    loader: false,
    error,
  })),

  // Add Invoice
  on(invoiceActions.addInvoiceSuccess, (state, { res }) =>
    invoiceAdapter.addOne(res, state)
  ),
  on(invoiceActions.addInvoiceFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // Update Invoice
  on(invoiceActions.updateInvoiceSuccess, (state, { res }) =>
    invoiceAdapter.updateOne(res, state)
  ),
  on(invoiceActions.updateInvoiceFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // Delete Invoice
  on(invoiceActions.deleteInvoiceSuccess, (state, { _id }) =>
    invoiceAdapter.removeOne(_id, state)
  ),
  on(invoiceActions.deleteInvoiceFail, (state, { error }) => ({
    ...state,
    error,
  }))
);
