import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StockApiService } from '../../service/stocks/stock-api.service';
import { StockStoreService } from '../../service/stocks/stock-store.service';
import * as stockActions from '../../store/actions/stocks.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { CommonService } from '../../service/common/common.service';
import { Update } from '@ngrx/entity';
import { Stock } from '../models/stocks.model';

@Injectable()
export class StockEffects {
  constructor(
    private actions$: Actions,
    private stockApi: StockApiService,
    private stockStore: StockStoreService,
    private commonService: CommonService
  ) {}

  loadStocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stockActions.loadStock),
        mergeMap((action) => {
          return this.stockApi.getStocks(action.params).pipe(
            map((res: any) => {
                this.stockStore.loadStockSuccess(
                  res.body ?? [],
                  res?.total ?? 0,
                  action.isMore
                );
              if(action.isMore) this.stockStore.setStockSubLoader(false);
            }),
            catchError(() => {
              this.stockStore.loadStockFail('Stock load failed');
              if (action.isMore) this.stockStore.setStockSubLoader(false);
              this.commonService.showErrorToast('Stock load failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  addStocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stockActions.addStock),
        mergeMap((action) => {
          return this.stockApi.addStock(action.payload).pipe(
            map((res: Stock) => {
              if (res) {
                this.stockStore.addStockSuccess(res);
                this.commonService.showSuccessToast('Stock add successful');
              } else {
              this.stockStore.addStockFail('Stock add failed');
                this.commonService.showErrorToast('Stock add failed');
              }
              this.commonService.dismissLoading();
            }),
            catchError(() => {
              this.stockStore.addStockFail('Stock add failed');
              this.commonService.dismissLoading();
              this.commonService.showErrorToast('Stock add failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  updateStocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stockActions.updateStock),
        mergeMap((action) => {
          return this.stockApi.updateStock(action.payload).pipe(
            map((res: Stock) => {
              if (res) {
                let response: Update<Stock> = {
                  id: res._id,
                  changes: {
                    ...res,
                  },
                };
                this.stockStore.updateStockSuccess(response);
                this.commonService.showSuccessToast('Stock update successful');
              } else {
              this.stockStore.updateStockFail('Stock update failed');
                this.commonService.showErrorToast('Stock update failed');
              }
              this.commonService.dismissLoading();
            }),
            catchError(() => {
              this.stockStore.updateStockFail('Stock update failed');

              this.commonService.dismissLoading();
              this.commonService.showErrorToast('Stock update failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  deleteStocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stockActions.deleteStock),
        mergeMap((action) => {
          return this.stockApi.deleteStock(action.id).pipe(
            map((res: any) => {
              this.stockStore.deleteStockSuccess(action.id);
              this.commonService.showSuccessToast('Stock delete successful');
              this.commonService.dismissLoading();
            }),
            catchError(() => {
              this.stockStore.deleteStockFail('Stock delete failed');
              this.commonService.dismissLoading();
              this.commonService.showErrorToast('Stock delete failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  searchStocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stockActions.searchStock),
        switchMap((action) => {
          return this.stockApi.searchStock(action.params).pipe(
            map((res: any) => {
              if (res?.body?.length) {
                this.stockStore.searchStockSuccess(res.body ?? [], res?.total ?? 0);
              } else {
                this.commonService.showErrorToast('Stock search failed');
              }
            }),
            catchError((err) => {
              let errorMessage = err?.error?.message || 'Stock search failed';
              this.stockStore.searchStockFail(errorMessage);
              this.commonService.showErrorToast(errorMessage);
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );
}
