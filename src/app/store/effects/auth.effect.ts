import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as authActions from '../../store/actions/auth.action';
import { catchError, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { AuthApiService } from '../../service/auth/auth-api.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../../service/auth/auth.service';
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authStore: AuthStoreService,
    private authApi: AuthApiService,
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService,
  ) {}

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.login),
        exhaustMap((action) =>
          this.authApi.login(action.payload).pipe(
            map((res: any) => {
              this.commonService.dismissLoading();
              this.authStore.loginSuccess(res.accessToken);
              this.commonService.showSuccessToast('Login successful');
              sessionStorage.setItem('accessToken', res.accessToken);
              this.router.navigate(['/dashboard']);
            }),
            catchError((err) => {
              this.commonService.dismissLoading();
              this.commonService.showErrorToast('Login failed');
              this.authStore.loginFail('Login failed');
              return of(err);
            })
          )
        )
      ),
    { dispatch: false }
  );

  register$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.register),
        exhaustMap((action) =>
          this.authApi.register(action.payload).pipe(
            map((res: any) => {
              this.commonService.dismissLoading();
              this.authStore.registerSuccess(res?.message);
              this.commonService.showSuccessToast(res?.message);
              this.router.navigate(['/auth']);
            }),
            catchError((err: any) => {
              console.log('err: ', err);
              const errMsg = err?.error?.message ?? 'Register failed';
              this.commonService.dismissLoading();
              this.commonService.showErrorToast(errMsg);
              this.authStore.registerFail(errMsg);
              return of(err);
            })
          )
        )
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.logout),
    map(() =>{
      this.authStore.logoutSuccess();
      this.router.navigate(['/auth']);
    }),
    catchError((err) =>{
      this.authStore.loginFail('logout failed');
      this.commonService.showErrorToast('Logout failed');
      return of(err)
    })
),
{dispatch: false}
);

  loadUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loadUser),
        mergeMap((action: any) =>
          this.authApi.getUser(action.id).pipe(
            map((res: User) => {
              this.authStore.loadUserSuccess(res);
            }),
            catchError((err: any) => {
              this.authService.executeLogout();
              return of(err);
            })
          )
        )
      ),
    { dispatch: false }
  );
}
