import { setLoader } from './../actions/auth.action';
import { createReducer, on } from '@ngrx/store';
import * as CustomerActions from '../actions/customer-summary.actions';
import { CustomerSummary } from '../../store/models/sold-products.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PaymentStatus, SalesReportPeriod } from '../models/common.model';

export interface CustomerSummaryState extends EntityState<CustomerSummary>{
  total: number;
  loader: boolean;
  subloader: boolean;
  loaded: boolean;
  date: string;
  status: PaymentStatus;
  period: SalesReportPeriod;
  error: any;
}

export const defaultCustomerSummary: CustomerSummaryState = {
  ids: [],
  entities: {},
  total: 0,
  loader: true,
  subloader: false,
  loaded: false,
  date: '',
  status: PaymentStatus.PAID,
  period: SalesReportPeriod.MONTHLY,
  error: null,
};

export const customerSummaryAdapter: EntityAdapter<CustomerSummary> = createEntityAdapter<CustomerSummary>({
  selectId: (summary: CustomerSummary) => summary?.customerId
});

const initialState:CustomerSummaryState = customerSummaryAdapter.getInitialState(defaultCustomerSummary);

const { selectAll } = customerSummaryAdapter.getSelectors();

export const customerSummaryReducer = createReducer(
  initialState,

  on(CustomerActions.loadCustomerSummaryList, (state, action) => ({
    ...state,
    loader: action?.isMore ? false: true,
    subloader: action.isMore,
    error: null,
  })),

  on(CustomerActions.loadCustomerSummaryListSuccess, (state, { response, isMore }) => {
    let res = response?.body;
    if(isMore){
      res = [...selectAll(state), ...response?.body];
    }
    return customerSummaryAdapter.setAll(res, {
      ...state,
      loader: false,
      subloader: false,
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
