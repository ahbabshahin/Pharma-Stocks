import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SalesReportApiService } from '../../service/sales-report/sales-report-api.service';
import { SalesReportStoreService } from '../../service/sales-report/sales-report-store.service';
import * as salesReportActions from '../../store/actions/sales-report.action.action';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { CustomerWiseSalesReportResponse, DailyReportResponse, ProductReportResponse, SalesReportResponse, SalesSummaryByArea } from '../models/sales-report.model';
import { CommonService } from '../../service/common/common.service';

@Injectable()
export class SalesReportEffects {
  constructor(
    private actions$: Actions,
    private salesReportApi: SalesReportApiService,
    private salesReportStore: SalesReportStoreService,
    private commonService: CommonService
  ) {}

  loadDailyReport$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(salesReportActions.loadDailyReport),
        switchMap((action) => {
          return this.salesReportApi.getDailySalesReport(action.params).pipe(
            map((res: DailyReportResponse) => {
              this.salesReportStore.loadDailyReportSuccess(res);
            }),
            catchError((err) => {
              this.commonService.showErrorToast('Daily sales load failed');
              return of(err);
            })
          );
        })
      ),
    { dispatch: false }
  );

  loadProductReport$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(salesReportActions.loadProductReport),
        switchMap((action) => {
          return this.salesReportApi.getProductReport(action.params).pipe(
            map((res: ProductReportResponse) => {
              this.salesReportStore.loadProductReportSuccess(res);
            }),
            catchError((err) => {
              this.commonService.showErrorToast('Product report load failed');
              return of(err);
            })
          );
        })
      ),
    { dispatch: false }
  );

  loadSalesSummaryByArea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(salesReportActions.loadSalesSummaryByAllArea),
      switchMap((action) => {
        return this.salesReportApi.getSalesSummaryByAllArea(action.params).pipe(
          map((res: SalesSummaryByArea) => {
            return salesReportActions.loadSalesSummaryByAllAreaSuccess({
              res,
            });
          }),
          catchError((err) => {
            this.commonService.showErrorToast('Area wise sales report load failed');
            return of(
              salesReportActions.loadSalesSummaryByAllAreaFail({ error: err })
            );
          })
        );
      })
    )
  );

  loadCustomerWiseSalesReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(salesReportActions.loadCustomerWiseSalesReport),
      switchMap((action) => {
        return this.salesReportApi
          .getCustomerWiseSalesReport(action.params)
          .pipe(
            map((res: CustomerWiseSalesReportResponse) => {
              return salesReportActions.loadCustomerWiseSalesReportSuccess({
                res,
              });
            }),
            catchError((err) => {
              this.commonService.showErrorToast('Customer wise sales report load failed');
              return of(
                salesReportActions.loadCustomerWiseSalesReportFail({
                  error: err,
                })
              );
            })
          );
      })
    )
  );
}
