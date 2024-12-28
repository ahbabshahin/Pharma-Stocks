import { createFeatureSelector, createSelector } from "@ngrx/store";
import { stockAdapter, StockState } from "../reducers/stocks.reducer";
import { stockStateName } from "../app.state";

export const getStockState = createFeatureSelector<StockState>(stockStateName);

export const getStockLoader = createSelector(
  getStockState,
  (state: StockState) => state.loader
);

export const getStockSubLoader = createSelector(
  getStockState,
  (state: StockState) => state.subLoader
);

export const getStockLoaded = createSelector(
  getStockState,
  (state: StockState) => state.loaded
);

export const getStockError = createSelector(
  getStockState,
  (state: StockState) => state.error
);

export const getStocks = createSelector(
  getStockState,
  stockAdapter.getSelectors().selectAll
);


