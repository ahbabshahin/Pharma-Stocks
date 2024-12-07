import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import { invoiceReducer, InvoiceState } from "./reducers/invoice.reducer";

export const invoiceStateName = 'invoice';
export interface AppState {
  [invoiceStateName]: InvoiceState;
  router: RouterReducerState;
}
export const appReducer = {
  [invoiceStateName]: invoiceReducer,

  router: routerReducer,
};
