import { createFeatureSelector, createSelector } from '@ngrx/store';
import { invoiceAdapter, InvoiceState } from '../reducers/invoice.reducer'
import { invoiceStateName } from '../app.state';


export const getInvoiceState =
  createFeatureSelector<InvoiceState>(invoiceStateName);

export const getInvoiceLoader = createSelector(
  getInvoiceState,
  (state: InvoiceState) => state.loader
);

export const getInvoiceSubLoader = createSelector(
  getInvoiceState,
  (state: InvoiceState) => state.subLoader
);
export const getInvoiceLoaded = createSelector(
  getInvoiceState,
  (state: InvoiceState) => state.loaded
);
export const getInvoiceError = createSelector(
  getInvoiceState,
  (state: InvoiceState) => state.error
);

export const getTotalInvoice = createSelector(
  getInvoiceState,
  (state: InvoiceState) => state.total
);

export const getInvoices = createSelector(
  getInvoiceState,
  invoiceAdapter.getSelectors().selectAll
);
