import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../../service/common/common.service';
import { AreaCodeApiService } from '../../service/area-code/area-code-api.service';
import * as areaCodeActions from '../actions/area-code.action';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { AreaCode } from '../models/area-code.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class AreaCodeEffect {
  constructor(
    private actions$: Actions,
    private commonService: CommonService,
    private areaCodeApi: AreaCodeApiService
  ) {}

  loadAreaCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(areaCodeActions.loadAreaCodes),
      mergeMap(() => {
        return this.areaCodeApi.getAllAreaCode().pipe(
          map((res: AreaCode[]) => {
            return areaCodeActions.loadAreaCodesSuccess({ res });
          }),
          catchError((err) => {
            let errMsg: string = err || 'Load area codes failed';
            return of(areaCodeActions.loadAreaCodesFail({ error: errMsg }));
          })
        );
      })
    )
  );

  addAreaCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(areaCodeActions.addAreaCode),
      exhaustMap((action) => {
        return this.areaCodeApi.addAreaCode(action.payload).pipe(
          map((res: AreaCode) => {
            this.commonService.showSuccessToast('Area code added successfully');
            return areaCodeActions.addAreaCodeSuccess({ res });
          }),
          catchError((err) => {
            let errMsg: string = err || 'Add area code failed';
            return of(areaCodeActions.addAreaCodeFail({ error: errMsg }));
          })
        );
      })
    )
  );

  updateAreaCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(areaCodeActions.updateAreaCode),
      exhaustMap((action) => {
        return this.areaCodeApi.updateAreaCode(action.payload).pipe(
          map((res: AreaCode) => {
            this.commonService.showSuccessToast(
              'Area code updated successfully'
            );
            let response: Update<AreaCode> = {
              id: res._id as string,
              changes: res,
            };
            return areaCodeActions.updateAreaCodeSuccess({ res: response });
          }),
          catchError((err) => {
            let errMsg: string = err || 'Update area code failed';
            return of(areaCodeActions.updateAreaCodeFail({ error: errMsg }));
          })
        );
      })
    )
  );

  deleteAreaCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(areaCodeActions.deleteAreaCode),
      exhaustMap((action) => {
        return this.areaCodeApi.deleteAreaCode(action.id).pipe(
          map(() => {
            this.commonService.showSuccessToast(
              'Area code deleted successfully'
            );
            return areaCodeActions.deleteAreaCodeSuccess({ id: action.id });
          }),
          catchError((err) => {
            let errMsg: string = err || 'Delete area code failed';
            return of(areaCodeActions.deleteAreaCodeFail({ error: errMsg }));
          })
        );
      })
    )
  );
}
