import { createAction, props } from '@ngrx/store';
import { Stock } from '../models/stocks.model';
import { Update } from '@ngrx/entity';

export const setStockSubLoader = createAction(
  '[Stock] set stock sub loader',
  props<{ status: boolean }>()
);

export const loadStock = createAction(
  '[Stock] load stock',
  props<{ params: { [key: string]: any } }>()
);
export const loadStockSuccess = createAction(
  '[Stock] load stock success',
  props<{ res: Stock[] }>()
);
export const loadStockFail = createAction(
  '[Stock] load stock fail',
  props<{ error: string }>()
);

export const addStock = createAction(
  '[Stock] add stock',
  props<{ payload: Stock }>()
);
export const addStockSuccess = createAction(
  '[Stock] add stock success',
  props<{ res: Stock }>()
);
export const addStockFail = createAction(
  '[Stock] add stock fail',
  props<{ error: string }>()
);

export const updateStock = createAction(
  '[Stock] update stock',
  props<{ payload: Stock }>()
);
export const updateStockSuccess = createAction(
  '[Stock] update stock success',
  props<{ res: Update<Stock> }>()
);
export const updateStockFail = createAction(
  '[Stock] update stock fail',
  props<{ error: string }>()
);

export const deleteStock = createAction(
  '[Stock] delete stock',
  props<{ id: string }>()
);
export const deleteStockSuccess = createAction(
  '[Stock] delete stock success',
  props<{ id: string }>()
);
export const deleteStockFail = createAction(
  '[Stock] delete stock fail',
  props<{ error: string }>()
);

export const searchStock = createAction(
  '[Stock] search stock',
  props<{ params: { [key: string]: any } }>()
);
export const searchStockSuccess = createAction(
  '[Stock] search stock success',
  props<{ res: Stock[] }>()
);
export const searchStockFail = createAction(
  '[Stock] search stock fail',
  props<{ error: string }>()
);


