import { createAction, props } from '@ngrx/store';
import { DeliveryResponse } from '../models/delivery.model';

export const loadDeliveryList = createAction(
  '[Delivery] load delivery list',
  props<{ params: { [keys: string]: any } }>()
);
export const loadDeliveryListSuccess = createAction(
  '[Delivery] load delivery list success',
  props<{ res: DeliveryResponse }>()
);
export const loadDeliveryListFail = createAction(
  '[Delivery] load delivery list fail',
  props<{ error: string }>()
);
