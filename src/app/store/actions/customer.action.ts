import { createAction, props } from "@ngrx/store";
import { Customer } from "../models/customer.model";
import { Update } from "@ngrx/entity";
import { AreaCode } from "../models/area-code.model";

export const setCustomerSubLoader = createAction(
  '[Customer] set customer sub loader',
  props<{ status: boolean }>()
);

export const loadCustomer = createAction(
  '[Customer] load customer',
  props<{ params: { [key: string]: any }; isMore: boolean }>()
);
export const loadCustomerSuccess = createAction(
  '[Customer] load customer success',
  props<{ res: Customer<AreaCode>[], total: number, isMore: boolean }>()
);
export const loadCustomerFail = createAction(
  '[Customer] load customer fail',
  props<{ error: string }>()
);

export const addCustomer = createAction(
  '[Customer] add customer',
  props<{ payload: Customer<string> }>()
);
export const addCustomerSuccess = createAction(
  '[Customer] add customer success',
  props<{ res: Customer<AreaCode> }>()
);
export const addCustomerFail = createAction(
  '[Customer] add customer fail',
  props<{ error: string }>()
);

export const updateCustomer = createAction(
  '[Customer] update customer',
  props<{ payload: Customer<string> }>()
);
export const updateCustomerSuccess = createAction(
  '[Customer] update customer success',
  props<{ res: Update<Customer<AreaCode>> }>()
);
export const updateCustomerFail = createAction(
  '[Customer] update customer fail',
  props<{ error: string }>()
);

export const deleteCustomer = createAction(
  '[Customer] delete customer',
  props<{ id: string }>()
);
export const deleteCustomerSuccess = createAction(
  '[Customer] delete customer success',
  props<{ id: string }>()
);
export const deleteCustomerFail = createAction(
  '[Customer] delete customer fail',
  props<{ error: string }>()
);

export const searchCustomer = createAction(
  '[Customer] search customer',
  props<{ params: {[key: string]: any}, isMore?: boolean }>()
);
export const searchCustomerSuccess = createAction(
  '[Customer] search customer success',
  props<{ res: Customer<AreaCode>[] }>()
);
export const searchCustomerFail = createAction(
  '[Customer] search customer fail',
  props<{ error: string }>()
);

