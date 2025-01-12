import { authReducer } from "./reducers/auth.reducer";
import { customerReducer } from "./reducers/customer.reducer";
import { invoiceReducer } from "./reducers/invoice.reducer";
import { stockReducer } from "./reducers/stocks.reducer";

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
