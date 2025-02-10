import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommonService } from "../../service/common/common.service";
import { UserApiService } from "../../service/user/user-api.service";
import { UserStoreService } from "../../service/user/user-store.service";
import * as userActions from "../actions/user.action";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()

export class UserEffects{

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

        }),
        catchError((err) =>{
          return of();
        })
      )
    })
  ),
  {dispatch: false}
)

}
