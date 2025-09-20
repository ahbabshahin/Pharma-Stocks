import { createReducer, on } from '@ngrx/store';
import * as FilterActions from '../actions/filter.action';
import { PaymentStatus, SalesReportPeriod } from '../models/common.model';

export interface FilterState {
  status: PaymentStatus;
  date: string;
  period: SalesReportPeriod;
}

const initialState: FilterState = {
  status: PaymentStatus.PAID,
  date: new Date().toISOString().split('T')[0], // default today
  period: SalesReportPeriod.MONTHLY,
};

export const filterReducer = createReducer(
  initialState,

  on(FilterActions.setFilterStatus, (state, { status }) => ({
    ...state,
    status,
  })),

  on(FilterActions.setFilterDate, (state, { date }) => ({
    ...state,
    date,
  })),

  on(FilterActions.setFilterPeriod, (state, { period }) => ({
    ...state,
    period,
  })),

  on(FilterActions.resetFilters, () => initialState)
);
