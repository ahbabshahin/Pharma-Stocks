import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CustomerActions from '../actions/customer-summary.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SalesReportApiService } from '../../service/sales-report/sales-report-api.service';

@Injectable()
export class CustomerSummaryEffects {

  constructor(
    private actions$: Actions,
    private salesReportApi: SalesReportApiService,
  ){}

  loadCustomerSummaryList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomerSummaryList),
      mergeMap(({ params }) =>
        this.salesReportApi.getCustomerSummaryList(params).pipe(
          map((response) =>
            CustomerActions.loadCustomerSummaryListSuccess({ response })
          ),
          catchError((error) =>
            of(CustomerActions.loadCustomerSummaryListFailure({ error }))
          )
        )
      )
    )
  );
}
