import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SalesReportApiService } from '../../service/sales-report/sales-report-api.service';
import { SalesReportStoreService } from '../../service/sales-report/sales-report-store.service';
import * as salesReportActions from '../../store/actions/sales-report.action.action';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { DailyReportResponse } from '../models/sales-report.model';
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
}
