import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AuthState } from '../../store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import * as authActions from '../../store/actions/auth.action';
import * as authSelectors from '../../store/selectors/auth.selector';
import { LoginCred, RegisterCred, User } from '../../store/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  constructor(private store: Store<AuthState>) {}

  dispatch = (action: Action) => this.store.dispatch(action);
  select = <T>(action: any): Observable<T> => this.store.select(action);

  setLoader(status: boolean) {
    this.dispatch(authActions.setLoader({ status }));
  }

  login(payload: LoginCred) {
    this.dispatch(authActions.login({ payload }));
  }
  loginSuccess(res: any) {
    this.dispatch(authActions.loginSuccess({ res }));
  }
  loginFail(error: string) {
    this.dispatch(authActions.loginFail({ error }));
  }

  register(payload: RegisterCred) {
    this.dispatch(authActions.register({ payload }));
  }
  registerSuccess(res: any) {
    this.dispatch(authActions.registerSuccess({ res }));
  }
  registerFail(error: string) {
    this.dispatch(authActions.registerFail({ error }));
  }

  logout() {
    this.dispatch(authActions.logout());
  }
  logoutSuccess() {
    this.dispatch(authActions.logoutSuccess());
  }
  logoutFail(error: string) {
    this.dispatch(authActions.logoutFail({ error }));
  }

  loadUser(id: string) {
    this.dispatch(authActions.loadUser({ id }));
  }
  loadUserSuccess(res: any) {
    this.dispatch(authActions.loadUserSuccess({ res }));
  }
  loadUserFail(error: string) {
    this.dispatch(authActions.loadUserFail({ error }));
  }

  getUser = (): Observable<User[]> => this.select(authSelectors.getUser);
}
