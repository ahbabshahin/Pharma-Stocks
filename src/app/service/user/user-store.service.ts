import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { UserState } from '../../store/reducers/user.reducer';
import * as userActions from '../../store/actions/user.action';
import { EditRolePayload, User } from '../../store/models/user.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class UserStoreService {

  constructor(private store: Store<UserState>) { }

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (action: any) => this.store.select(action);

  loadUsers(params: { [key: string]: any },  isMore: boolean){
    this.dispatch(userActions.loadUsers({params, isMore}));
  }
  loadUsersSuccess(res: User[], total: number, isMore: boolean){
    this.dispatch(userActions.loadUsersSuccess({res, total, isMore}));
  }
  loadUsersFail(error: string){
    this.dispatch(userActions.loadUsersFail({error}));
  }

  updateUser(payload: User){
    this.dispatch(userActions.updateUser({payload}))
  }
  updateUserSuccess(res: Update<User>){
    this.dispatch(userActions.updateUserSuccess({res}))
  }
  updateUserFail(error: string){
    this.dispatch(userActions.updateUserFail({error}))
  }

  editRole(payload: EditRolePayload){
    this.dispatch(userActions.editRole({payload}));
  }
  editRoleSuccess(res: Update<User>){
    this.dispatch(userActions.editRoleSuccess({res}));
  }
  editRoleFail(error: string){
    this.dispatch(userActions.editRoleFail({error}));
  }

  deleteUser(id: string){
    this.dispatch(userActions.deleteUser({id}))
  }

  deleteUserSuccess(id: string){
    this.dispatch(userActions.deleteUserSuccess({id}))
  }

  deleteUserFail(error: string){
    this.dispatch(userActions.deleteUserFail({error}))
  }
}
