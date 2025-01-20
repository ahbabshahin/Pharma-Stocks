import { Action } from "@ngrx/store";
import { authReducer } from "./reducers/auth.reducer";
import { customerReducer } from "./reducers/customer.reducer";
import { invoiceReducer } from "./reducers/invoice.reducer";
import { stockReducer } from "./reducers/stocks.reducer";
// import { logout } from "./actions/auth.action";
import * as authActions from './actions/auth.action';

export class AppState{}
export const authStateName = 'auth';
export const invoiceStateName = 'invoice';
export const stockStateName = 'stock';
export const customerStateName = 'customer';

export const appReducer = {
  [authStateName]: authReducer,
  [invoiceStateName]: invoiceReducer,
  [stockStateName]: stockReducer,
  [customerStateName]: customerReducer,
};

export const LOGOUT = '[Auth] Logout';

export function resetState(reducer: any): any {
  return (state: any, action: Action): any => {
    if (action.type === authActions?.logout.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}


export const metaReducers = [resetState];
