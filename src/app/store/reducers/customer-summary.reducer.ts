import { setLoader } from './../actions/auth.action';
import { createReducer, on } from '@ngrx/store';
import * as CustomerActions from '../actions/customer-summary.actions';
import { CustomerSummary } from '../../store/models/sold-products.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface CustomerSummaryState extends EntityState<CustomerSummary>{
  total: number;
  loader: boolean;
  loaded: boolean;
  error: any;
}

export const defaultCustomerSummary: CustomerSummaryState = {
  ids: [],
  entities: {},
  total: 0,
  loader: false,
  loaded: false,
  error: null,
};

export const customerSummaryAdapter: EntityAdapter<CustomerSummary> = createEntityAdapter<CustomerSummary>({
  selectId: (summary: CustomerSummary) => summary?.customerId
});

const initialState:CustomerSummaryState = customerSummaryAdapter.getInitialState(defaultCustomerSummary);

export const customerSummaryReducer = createReducer(
  initialState,

  on(CustomerActions.loadCustomerSummaryList, (state) => ({
    ...state,
    loader: true,
    error: null,
  })),

  on(CustomerActions.loadCustomerSummaryListSuccess, (state, { response }) => {
    return customerSummaryAdapter.setAll(response?.customers, {
      ...state,
      loader: false,
      loaded: true,
      total: response?.total,
      error: '',
    })
  }),

  on(CustomerActions.loadCustomerSummaryListFailure, (state, { error }) => ({
    ...state,
    loader: false,
    loaded: false,
    error,
  }))
);
