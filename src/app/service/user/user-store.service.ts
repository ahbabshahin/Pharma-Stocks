import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { UserState } from '../../store/reducers/user.reducer';
import * as userActions from '../../store/actions/user.action';
import { EditRolePayload, User } from '../../store/models/user.model';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import * as userSelectors from '../../store/selectors/user.selector';

@Injectable()
export class UserStoreService {
  constructor(private store: Store<UserState>) {}

  userRole: { label: string; value: string }[] = [
    { label: 'Office', value: 'office' },
    { label: 'Field', value: 'field' },
    { label: 'Delivery', value: 'delivery' },
    { label: 'Admin', value: 'admin' },
  ];

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (action: any) => this.store.select(action);

  loadUsers(params: { [key: string]: any }, isMore: boolean) {
    this.dispatch(userActions.loadUsers({ params, isMore }));
  }
  loadUsersSuccess(res: User[], total: number, isMore: boolean) {
    this.dispatch(userActions.loadUsersSuccess({ res, total, isMore }));
  }
  loadUsersFail(error: string) {
    this.dispatch(userActions.loadUsersFail({ error }));
  }

  addUser(payload: User) {
    this.dispatch(userActions.addUser({ payload }));
  }
  addUserSuccess(res: User) {
    this.dispatch(userActions.addUserSuccess({ res }));
  }
  addUserFail(error: string) {
    this.dispatch(userActions.addUserFail({ error }));
  }

  updateUser(payload: User) {
    this.dispatch(userActions.updateUser({ payload }));
  }
  updateUserSuccess(res: Update<User>) {
    this.dispatch(userActions.updateUserSuccess({ res }));
  }
  updateUserFail(error: string) {
    this.dispatch(userActions.updateUserFail({ error }));
  }

  editRole(payload: EditRolePayload) {
    this.dispatch(userActions.editRole({ payload }));
  }
  editRoleSuccess(res: Update<User>) {
    this.dispatch(userActions.editRoleSuccess({ res }));
  }
  editRoleFail(error: string) {
    this.dispatch(userActions.editRoleFail({ error }));
  }

  deleteUser(id: string) {
    this.dispatch(userActions.deleteUser({ id }));
  }

  deleteUserSuccess(id: string) {
    this.dispatch(userActions.deleteUserSuccess({ id }));
  }

  deleteUserFail(error: string) {
    this.dispatch(userActions.deleteUserFail({ error }));
  }

  getUserLoader = (): Observable<boolean> =>
    this.select(userSelectors.getUserLoader);
  getUserSubLoader = (): Observable<boolean> =>
    this.select(userSelectors.getUserSubLoader);
  getUserLoaded = (): Observable<boolean> =>
    this.select(userSelectors.getUserLoaded);
  getTotalUser = (): Observable<number> =>
    this.select(userSelectors.getTotalUser);
  getUserError = (): Observable<string> =>
    this.select(userSelectors.getUserError);
  getUsers = (): Observable<User[]> => this.select(userSelectors.getUsers);
}
