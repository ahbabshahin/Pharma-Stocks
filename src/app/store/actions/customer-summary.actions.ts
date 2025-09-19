import { createAction, props } from '@ngrx/store';
import { CustomerSummaryResponse } from '../../store/models/sold-products.model';

export const loadCustomerSummaryList = createAction(
  '[Customer] Load Customer Summary List',
  props<{ params: { [key: string]: any } }>()
);

export const loadCustomerSummaryListSuccess = createAction(
  '[Customer] Load Customer Summary List Success',
  props<{ response: CustomerSummaryResponse }>()
);

export const loadCustomerSummaryListFailure = createAction(
  '[Customer] Load Customer Summary List Failure',
  props<{ error: any }>()
);
