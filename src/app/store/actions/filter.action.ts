import { createAction, props } from '@ngrx/store';
import { PaymentStatus, SalesReportPeriod } from '../models/common.model';

export const setFilterStatus = createAction(
  '[Filter] Set Status',
  props<{ status: PaymentStatus }>()
);

export const setFilterDate = createAction(
  '[Filter] Set Date',
  props<{ date: string }>()
);

export const setFilterPeriod = createAction(
  '[Filter] Set Period',
  props<{ period: SalesReportPeriod }>()
);

export const resetFilters = createAction('[Filter] Reset');
