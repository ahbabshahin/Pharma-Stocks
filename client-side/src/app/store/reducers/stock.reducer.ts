import { EntityState } from "@ngrx/entity";
import { createReducer } from "@ngrx/store";

export interface StockState{
  loader: boolean;
}

export const initialState: StockState = {
  loader: false,
}

export const stockReducer = createReducer(
  initialState
)
