import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Stock } from "../models/stocks.model";
import { createReducer, on } from "@ngrx/store";
import * as stockActions from '../../store/actions/stocks.action';

export interface StockState extends EntityState<Stock> {
  loader: boolean;
  subLoader: boolean;
  loaded: boolean;
  total: number;
  error: string;
}

export const stockAdapter: EntityAdapter<Stock> = createEntityAdapter<Stock>({
  selectId: (stock: Stock) => stock._id as string,
})

const defaultStock: StockState = {
  ids: [],
  entities: {},
  loader: false,
  subLoader: false,
  loaded: false,
  total: 0,
  error: "",
}

export const initialState: StockState = stockAdapter.getInitialState(defaultStock);

const { selectAll } = stockAdapter.getSelectors();

export const stockReducer = createReducer(
  initialState,
  on(stockActions.loadStock, (state, action) => {
    return {
      ...state,
      loader: action.isMore ? false: true,
      loaded: false,
    };
  }),
  on(stockActions.loadStockSuccess, (state, action) => {
    let response = action.res;
    if(action.isMore) response = [...selectAll(state), ...action.res]
    return stockAdapter.setAll(response, {
      ...state,
      loader: false,
      loaded: true,
      total: action.total
    });
  }),
  on(stockActions.loadStockFail, (state, action) => {
    return {
      ...state,
      loader: false,
      loaded: false,
      error: action.error,
    };
  }),
  on(stockActions.setStockSubLoader, (state, action) =>{
    return {
      ...state,
      subLoader: action.status,
    }
  }),
  on(stockActions.addStockSuccess, (state, action) => {
    return stockAdapter.addOne(action.res, state);
  }),
  on(stockActions.addStockFail, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(stockActions.updateStockSuccess, (state, action) => {
    return stockAdapter.updateOne(action.res, state);
  }),
  on(stockActions.updateStockFail, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(stockActions.deleteStockSuccess, (state, action) => {
    return stockAdapter.removeOne(action.id, state);
  }),
  on(stockActions.deleteStockFail, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(stockActions.searchStock, (state, action) => {
    return {
      ...state,
      loader: true,
    };
  }),
  on(stockActions.searchStockSuccess, (state, action) => {
    return stockAdapter.setAll(action.res, {
      ...state,
      loader: false,
    });
  }),
  on(stockActions.searchStockFail, (state, action) => {
    return {
      ...state,
      loader: false,
      error: action.error
    };
  })
);
