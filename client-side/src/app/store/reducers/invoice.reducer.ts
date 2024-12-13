import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Invoice } from '../models/invoice.model';
import { createReducer, on } from '@ngrx/store';
import * as invoiceActions from '../../store/actions/invoice.action';

export interface InvoiceState extends EntityState<Invoice> {
  loader: boolean;
  subLoader: boolean;
  loaded: boolean;
  total: number;
  error: string;
}

export const defaultInvoiceState: InvoiceState = {
  ids: [],
  entities: {},
  loader: false,
  subLoader: false,
  loaded: false,
  total: 0,
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
  on(invoiceActions.setLoader, (state, action) => {
    console.log('reducer status ', action.status);
    return {
    ...state,
    loader: action.status,
  }}),

  // Set SubLoader
  on(invoiceActions.setSubLoader, (state, { status }) => ({
    ...state,
    subLoader: status,
  })),

  // Load Invoices
  on(invoiceActions.loadInvoice, (state, action) => {
    return {
      ...state,
    loaded: true,
    error: '',
    }
  }),
  on(invoiceActions.loadInvoiceSuccess, (state, action) =>{
    console.log('action.res: ', action.res);
    return invoiceAdapter.setAll(action.res, {
      ...state,
      loaded: false,
    })
  }),
  on(invoiceActions.loadInvoiceFail, (state, { error }) => ({
    ...state,
    loaded: false,
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
