import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { StockState } from '../../store/reducers/stocks.reducer';
import { Observable } from 'rxjs';
import * as stockActions from '../../store/actions/stocks.action';
import { Stock } from '../../store/models/stocks.model';
import { Update } from '@ngrx/entity';
import * as stockSelectors from '../../store/selectors/stocks.selector';

@Injectable()
export class StockStoreService {
  constructor(private store: Store<StockState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = <T>(action: any): Observable<T> => this.store.select(action);

  setStockSubLoader(status: boolean) {
    this.dispatch(stockActions.setStockSubLoader({ status }));
  }

  loadStock(params: { [key: string]: any }, isMore: boolean) {
    this.dispatch(stockActions.loadStock({ params, isMore }));
  }
  loadStockSuccess(res: Stock[], total: number, isMore: boolean) {
    this.dispatch(stockActions.loadStockSuccess({ res, total, isMore }));
  }
  loadStockFail(error: string) {
    this.dispatch(stockActions.loadStockFail({ error }));
  }

  addStock(payload: Stock) {
    this.dispatch(stockActions.addStock({ payload }));
  }
  addStockSuccess(res: Stock) {
    this.dispatch(stockActions.addStockSuccess({ res }));
  }
  addStockFail(error: string) {
    this.dispatch(stockActions.addStockFail({ error }));
  }

  updateStock(payload: Stock) {
    this.dispatch(stockActions.updateStock({ payload }));
  }
  updateStockSuccess(res: Update<Stock>) {
    this.dispatch(stockActions.updateStockSuccess({ res }));
  }
  updateStockFail(error: string) {
    this.dispatch(stockActions.updateStockFail({ error }));
  }

  deleteStock(id: string) {
    this.dispatch(stockActions.deleteStock({ id }));
  }
  deleteStockSuccess(id: string) {
    this.dispatch(stockActions.deleteStockSuccess({ id }));
  }
  deleteStockFail(error: string) {
    this.dispatch(stockActions.deleteStockFail({ error }));
  }

  searchStock(params: { [key: string]: any }) {
    this.dispatch(stockActions.searchStock({ params }));
  }
  searchStockSuccess(res: Stock[]) {
    this.dispatch(stockActions.searchStockSuccess({ res }));
  }
  searchStockFail(error: string) {
    this.dispatch(stockActions.searchStockFail({ error }));
  }

  // selectors

  getStockLoader = (): Observable<boolean> =>
    this.select(stockSelectors.getStockLoader);

  getStockSubLoader = (): Observable<boolean> =>
    this.select(stockSelectors.getStockSubLoader);

  getStockLoaded = (): Observable<boolean> =>
    this.select(stockSelectors.getStockLoaded);

  getTotalStock = (): Observable<number> =>
    this.select(stockSelectors.getTotalStock);

  getStockError = (): Observable<string> =>
    this.select(stockSelectors.getStockError);

  getStocks = (): Observable<Stock[]> => this.select(stockSelectors.getStocks);
}
