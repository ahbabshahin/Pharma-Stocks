import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Delivery } from "../models/delivery.model";
import { createReducer, on } from '@ngrx/store';
import * as deliveryActions from '../actions/delivery.action';

export interface DeliveryState extends EntityState<Delivery> {
  loader: boolean;
  loaded: boolean;
  total: number;
  date: string;
  areaCode: string;
  grandTotal: number;
  error: string;
}

const defaultDelivery: DeliveryState = {
  ids: [],
  entities: {},
  loader: false,
  loaded: false,
  total: 0,
  date: '',
  areaCode: '',
  grandTotal: 0,
  error: '',
};

export const deliveryAdapter: EntityAdapter<Delivery> = createEntityAdapter<Delivery>({
  selectId: (delivery: Delivery) => delivery?._id as string
});

const initialState: DeliveryState = deliveryAdapter.getInitialState(defaultDelivery);

export const deliveryReducer = createReducer(
  initialState,
  on(deliveryActions.loadDeliveryList, (state) =>{
    return {
      ...state,
      loader: true,
    }
  }),
  on(deliveryActions.loadDeliveryListSuccess, (state, {res: {body, areaCode, grandTotal, date}}) => {
    return deliveryAdapter.setAll(body, {
      ...state,
      total: body?.length,
      areaCode,
      grandTotal,
      date,
      loader: false,
      loaded: true,
      error: '',
    })
  }),
  on(deliveryActions.loadDeliveryListFail, (state, action) =>{
    return {
      ...state,
      loader: false,
      loaded: false,
      error: action.error,
    }
  }),
);
