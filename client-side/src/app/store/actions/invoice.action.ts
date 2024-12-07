import { createAction, props } from '@ngrx/store';
import { Invoice } from '../models/invoice.model';
import { Update } from '@ngrx/entity';

export const setLoader = createAction(
  '[Invoice] set loader',
  props<{ status: boolean }>()
);
export const setSubLoader = createAction(
  '[Invoice] set sub loader',
  props<{ status: boolean }>()
);

export const loadInvoice = createAction(
  '[Invoice] load invoice',
  props<{ params: { [key: string]: any } }>()
);
export const loadInvoiceSuccess = createAction(
  '[Invoice] load invoice success',
  props<{ res: Invoice[] }>()
);
export const loadInvoiceFail = createAction(
  '[Invoice] load invoice fail',
  props<{ error: any }>()
);

export const addInvoice = createAction(
  '[Invoice] add invoice',
  props<{ payload: Invoice }>()
);
export const addInvoiceSuccess = createAction(
  '[Invoice] add invoice success',
  props<{ res: Invoice }>()
);
export const addInvoiceFail = createAction(
  '[Invoice] add invoice fail',
  props<{ error: any }>()
);

export const updateInvoice = createAction(
  '[Invoice] update invoice',
  props<{ payload: Invoice }>()
);
export const updateInvoiceSuccess = createAction(
  '[Invoice] update invoice success',
  props<{ res: Update<Invoice> }>()
);
export const updateInvoiceFail = createAction(
  '[Invoice] update invoice fail',
  props<{ error: any }>()
);

export const deleteInvoice = createAction(
  '[Invoice] delete invoice',
  props<{ _id: string }>()
);
export const deleteInvoiceSuccess = createAction(
  '[Invoice] delete invoice success',
  props<{ _id: string }>()
);
export const deleteInvoiceFail = createAction(
  '[Invoice] delete invoice fail',
  props<{ error: any }>()
);
