import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../../service/common/common.service';
import { DeliveryApiService } from '../../service/delivery/delivery-api.service';
import * as deliveryActions from '../actions/delivery.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { DeliveryResponse } from '../models/delivery.model';

@Injectable()
export class DeliveryEffects {
  constructor(
    private actions$: Actions,
    private commonService: CommonService,
    private deliveryApi: DeliveryApiService
  ) {}

  loadDeliveryList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deliveryActions.loadDeliveryList),
      mergeMap((action) => {
        return this.deliveryApi.getDeliveryList(action.params).pipe(
          map((res: DeliveryResponse) => {
            return deliveryActions.loadDeliveryListSuccess({ res });
          }),
          catchError((err) => {
            let errMsg = err || 'Load delivery liist failed';
            return of(deliveryActions.loadDeliveryListFail({ error: errMsg }));
          })
        );
      })
    )
  );
}
