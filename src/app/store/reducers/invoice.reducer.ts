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
    selectId: (invoice: Invoice) => invoice._id as string,
  });
export const initialState: InvoiceState =
  invoiceAdapter.getInitialState(defaultInvoiceState);

const { selectAll } = invoiceAdapter.getSelectors();

export const invoiceReducer = createReducer(
  initialState,

  // Set Loader
  on(invoiceActions.setLoader, (state, action) => {
    return {
      ...state,
      loader: action.status,
    };
  }),

  // Set Invoice Loaded
  on(invoiceActions.setInvoiceLoaded, (state, action) => {
    return {
      ...state,
      loaded: action.status,
    };
  }),
  // Set SubLoader
  on(invoiceActions.setSubLoader, (state, { status }) => ({
    ...state,
    subLoader: status,
  })),

  // Load Invoices
  on(invoiceActions.loadInvoice, (state, action) => {
    return {
      ...state,
      // loaded: action.isMore ? true : false,
      // loader: action.isMore ? false : true,
      error: '',
    };
  }),
  on(invoiceActions.loadInvoiceSuccess, (state, action) => {
    let response = [...selectAll(state), ...action.res];
    if (!action.isMore) response = action.res;
    return invoiceAdapter.setAll(response, {
      ...state,
      loaded: true,
      loader: false,
      total: action.total,
    });
  }),
  on(invoiceActions.loadInvoiceFail, (state, { error }) => ({
    ...state,
    loaded: false,
    loader: false,
    error,
  })),

  // Add Invoice
  on(invoiceActions.addInvoiceSuccess, (state, { res }) =>
    invoiceAdapter.addOne(res, { ...state, total: state.total + 1 })
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
  on(invoiceActions.deleteInvoiceSuccess, (state, action) =>
    invoiceAdapter.removeOne(action.id, { ...state, total: state.total - 1 })
  ),
  on(invoiceActions.deleteInvoiceFail, (state, { error }) => ({
    ...state,
    error,
  }))
);
