import { createFeatureSelector, createSelector } from "@ngrx/store";
import { customerAdapter, CustomerState } from "../reducers/customer.reducer";
import { customerStateName } from "../app.state";

export const getCustomerState =
  createFeatureSelector<CustomerState>(customerStateName);

export const getCustomerLoader = createSelector(
  getCustomerState,
  (state: CustomerState) => state.loader
);

export const getCustomerSubLoader = createSelector(
  getCustomerState,
  (state: CustomerState) => state.subLoader
);

export const getCustomerLoaded = createSelector(
  getCustomerState,
  (state: CustomerState) => state.loaded
);

export const getCustomerTotal = createSelector(
  getCustomerState,
  (state: CustomerState) => state.total
);

export const getCustomerError = createSelector(
  getCustomerState,
  (state: CustomerState) => state.error
);

export const getCustomers = createSelector(
  getCustomerState,
  customerAdapter.getSelectors().selectAll
);
