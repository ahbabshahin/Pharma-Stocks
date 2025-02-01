import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Customer } from "../models/customer.model";
import { createReducer, on } from "@ngrx/store";
import * as customerActions from '../../store/actions/customer.action';

export interface CustomerState extends EntityState<Customer>{
  loader: boolean;
  subLoader: boolean;
  loaded: boolean;
  total: number;
  error: string;
}

export const customerAdapter: EntityAdapter<Customer> =
  createEntityAdapter<Customer>({
    selectId: (customer: Customer) => customer._id as string,
  });

const defaustCustomer: CustomerState = {
  ids: [],
  entities: {},
  loader: false,
  subLoader: false,
  loaded: false,
  total: 0,
  error: "",
}

export const initialState: CustomerState = customerAdapter.getInitialState(defaustCustomer);

export const { selectAll } = customerAdapter.getSelectors();

export const customerReducer = createReducer(
  initialState,
    on(customerActions.loadCustomer, (state, action) => {
      return {
        ...state,
        loader: action.isMore ? false: true,
        loaded: action.isMore ? true: false,
      };
    }),
    on(customerActions.loadCustomerSuccess, (state, action) => {
      let response = action?.res;
      if(action.isMore) {
        response = [...selectAll(state), ...action?.res];
      }
      return customerAdapter.setAll(response, {
        ...state,
        loader: false,
        loaded: true,
        total: action.total
      });
    }),
    on(customerActions.loadCustomerFail, (state, action) => {
      return {
        ...state,
        loader: false,
        loaded: false,
        error: action.error,
      };
    }),
    on(customerActions.setCustomerSubLoader, (state, action) =>{
      return {
        ...state,
        subLoader: action.status
      }
    }),
    on(customerActions.addCustomerSuccess, (state, action) => {
      let response = [action.res, ...selectAll(state)];
      return customerAdapter.setAll(response, state);
    }),
    on(customerActions.addCustomerFail, (state, action) => {
      return {
        ...state,
        error: action.error,
      };
    }),
    on(customerActions.updateCustomerSuccess, (state, action) => {
      return customerAdapter.updateOne(action.res, state);
    }),
    on(customerActions.updateCustomerFail, (state, action) => {
      return {
        ...state,
        error: action.error,
      };
    }),
    on(customerActions.deleteCustomerSuccess, (state, action) => {
      return customerAdapter.removeOne(action.id, state);
    }),
    on(customerActions.deleteCustomerFail, (state, action) => {
      return {
        ...state,
        error: action.error,
      };
    }),
    on(customerActions.searchCustomer, (state, action) => {
      return {
        ...state,
        loader: true,
        loaded: false,
      };
    }),
    on(customerActions.searchCustomerSuccess, (state, action) => {
      return customerAdapter.setAll(action.res, {
        ...state,
        loader: false,
        loaded: true,
      });
    }),
    on(customerActions.searchCustomerFail, (state, action) => {
      return {
        ...state,
        loader: false,
        loaded: false,
        error: action.error
      };
    })
);
