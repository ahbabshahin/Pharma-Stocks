import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  customerSummaryAdapter,
  CustomerSummaryState,
} from '../reducers/customer-summary.reducer';
import { customerSummaryStateName } from '../app.state';

export const selectCustomerState = createFeatureSelector<CustomerSummaryState>(
  customerSummaryStateName
);

export const getTotalCustomerSummary = createSelector(
  selectCustomerState,
  (state) => state.total
);

export const getCustomerSummaryLoader = createSelector(
  selectCustomerState,
  (state) => state.loader
);

export const getCustomerSummaryLoaded = createSelector(
  selectCustomerState,
  (state) => state.loaded
);

export const getCustomerError = createSelector(
  selectCustomerState,
  (state) => state.error
);

export const getCustomerSummaryList = createSelector(
  selectCustomerState,
  customerSummaryAdapter.getSelectors().selectAll
);
