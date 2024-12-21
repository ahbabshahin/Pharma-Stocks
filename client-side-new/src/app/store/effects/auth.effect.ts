import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as authActions from '../../store/actions/auth.action';
import { catchError, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { AuthApiService } from '../../service/auth/auth-api.service';
import { CommonService } from '../../service/common/common.service';
@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authStore: AuthStoreService,
    private authApi: AuthApiService,
        private commonService: CommonService,
  ){}

  login$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap(action => this.authApi.login(action.payload).pipe(
        map((res: any) =>{
          console.log('res: ', res);
          this.commonService.dismissLoading();
          this.authStore.loginSuccess(authActions.loginSuccess({ res: res.accessToken }))
        }
      ),catchError((err) =>{
        this.commonService.dismissLoading();
        this.commonService.showErrorToast('Login failed');
        this.authStore.loginFail('Login failed');
        return of(err)
      })
      )
    )
  ),
  { dispatch: false }
);
}
