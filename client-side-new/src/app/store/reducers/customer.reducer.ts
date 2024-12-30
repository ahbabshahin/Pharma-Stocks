import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Customer } from "../models/customer.model";
import { createReducer, on } from "@ngrx/store";
import * as customerActions from '../../store/actions/customer.action';

export interface CustomerState extends EntityState<Customer>{
  loader: boolean;
  subLoader: boolean;
  loaded: boolean;
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
  error: "",
}

export const initialState: CustomerState = customerAdapter.getInitialState(defaustCustomer);

export const { selectAll } = customerAdapter.getSelectors();

export const customerReducer = createReducer(
  initialState,
    on(customerActions.loadCustomer, (state, action) => {
      return {
        ...state,
        loader: true,
        loaded: false,
      };
    }),
    on(customerActions.loadCustomerSuccess, (state, action) => {
      return customerAdapter.setAll(action.res, {
        ...state,
        loader: false,
        loaded: true,
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
    on(customerActions.addCustomerSuccess, (state, action) => {
      return customerAdapter.addOne(action.res, state);
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
