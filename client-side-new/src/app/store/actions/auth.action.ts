import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { LoginCred, RegisterCred, User } from '../models/user.model';

export const setLoader = createAction(
  '[Auth] set auth loader',
  props<{ status: boolean }>()
);

export const login = createAction(
  '[Auth login] login',
  props<{ payload: LoginCred }>()
);
export const loginSuccess = createAction(
  '[Auth login] login success',
  props<{ res: string }>()
);
export const loginFail = createAction(
  '[Auth login] login fail',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth register] register',
  props<{ payload: RegisterCred }>()
);
export const registerSuccess = createAction(
  '[Auth register] register success',
  props<{ res: string }>()
);
export const registerFail = createAction(
  '[Auth register] register fail',
  props<{ error: string }>()
);

export const logout = createAction(
  '[Auth logout] logout',
);
export const logoutSuccess = createAction(
  '[Auth logout] logout success',
  props<{ res: string }>()
);
export const logoutFail = createAction(
  '[Auth logout] logout fail',
  props<{ error: string }>()
);

export const loadUser = createAction(
  '[Auth user] load user',
  props<{ id: string }>()
);
export const loadUserSuccess = createAction(
  '[Auth user] load user success',
  props<{ res: User }>()
);
export const loadUserFail = createAction(
  '[Auth user] load user fail',
  props<{ error: string }>()
);
