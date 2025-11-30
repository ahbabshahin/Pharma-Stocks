import { Action } from "@ngrx/store";
import { authReducer } from "./reducers/auth.reducer";
import { customerReducer } from "./reducers/customer.reducer";
import { invoiceReducer } from "./reducers/invoice.reducer";
import { stockReducer } from "./reducers/stocks.reducer";
// import { logout } from "./actions/auth.action";
import * as authActions from './actions/auth.action';
import { salesReportReducer } from "./reducers/sales-report.reducer";
import { customerSummaryReducer } from "./reducers/customer-summary.reducer";
import { filterReducer } from "./reducers/filter.reducer";
import { notificationReducer } from "./reducers/notification.reducer";
import { deliveryReducer } from "./reducers/delivery.reducer";
import { areaCodeReducer } from "./reducers/area-code.reducer";
import { userReducer } from "./reducers/user.reducer";

export class AppState{}
export const authStateName = 'auth';
export const invoiceStateName = 'invoice';
export const stockStateName = 'stock';
export const customerStateName = 'customer';
export const userStateName = 'user';
export const salesReportStateName = 'salesReport';
export const customerSummaryStateName = 'customerSummary';
export const filterStateName = 'filter';
export const notificationStateName = 'notifications';
export const deliveryStateName = 'delivery';
export const areaCodeStateName = 'areaCode';

export const appReducer = {
  [authStateName]: authReducer,
  [invoiceStateName]: invoiceReducer,
  [stockStateName]: stockReducer,
  [customerStateName]: customerReducer,
  [salesReportStateName]: salesReportReducer,
  [customerSummaryStateName]: customerSummaryReducer,
  [userStateName]: userReducer,
  [filterStateName]: filterReducer,
  [notificationStateName]: notificationReducer,
  [deliveryStateName]: deliveryReducer,
  [areaCodeStateName]: areaCodeReducer,
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
