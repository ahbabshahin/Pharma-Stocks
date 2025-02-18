import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommonService } from "../../service/common/common.service";
import { UserApiService } from "../../service/user/user-api.service";
import { UserStoreService } from "../../service/user/user-store.service";
import * as userActions from "../actions/user.action";
import { catchError, map, mergeMap, of } from "rxjs";
import { User } from "../models/user.model";
import { Update } from "@ngrx/entity";

@Injectable()

export class UserEffects {

    constructor(
    private actions$: Actions,
    private userApi: UserApiService,
    private userStore: UserStoreService,
    private commonService: CommonService,
    private router: Router
  ) {}

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(userActions.loadUsers),
    mergeMap((action) =>{
      return this.userApi.getUsers(action.params).pipe(
        map((res: any) =>{
          console.log('res: ', res);
          this.userStore.loadUsersSuccess(res?.body ?? [], res?.total ?? 0, action.isMore);
        }),
        catchError((err) =>{
          let errorMessage = err?.error?.message || 'User load failed';
          this.userStore.loadUsersFail(errorMessage);
            this.commonService.showErrorToast(errorMessage);
          return of();
        })
      )
    })
  ),
  {dispatch: false}
);

  editRole$ = createEffect(
    () => this.actions$.pipe(
      ofType(userActions.editRole),
      mergeMap((action) => {
        return this.userApi.editRole(action.payload).pipe(
          map((res: User) =>{
            let response: Update<User> = {
              id: res._id as string,
              changes: {
                ...res
              }
            }
            this.userStore.editRoleSuccess(response)
              this.commonService.dismissLoading();
              this.commonService.showSuccessToast('Edit user role successfully');
          }),
          catchError((err) => {
            let errorMessage = err?.error?.message || 'Edit user role failed';
            this.userStore.editRoleFail(errorMessage);
            this.commonService.showErrorToast(errorMessage)
            this.commonService.dismissLoading()
            return of();
          })
        )
      })
    ),
    {dispatch: false}
  );

  deleteUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(userActions.deleteUser),
      mergeMap((action) => {
        return this.userApi.deleteUser(action.id).pipe(
          map(() =>{
            this.commonService.dismissLoading();
            this.commonService.showSuccessToast('Delete user successfully');
            this.userStore.deleteUserSuccess(action.id)
          }),
          catchError((err) => {
            let errorMessage = err?.error?.message || 'Delete user failed';
            this.commonService.showErrorToast(errorMessage)
            this.userStore.deleteUserFail(errorMessage);
            this.commonService.dismissLoading()
            return of();
          })
        )
      })
    ),
    {dispatch: false}
  )

}
