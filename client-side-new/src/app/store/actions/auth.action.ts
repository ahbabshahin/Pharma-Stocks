import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { LoginCred, RegisterCred } from '../models/user.model';

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

export const loadUser = createAction(
  '[Auth register] load user',
  props<{ payload: any }>()
);
export const loadUserSuccess = createAction(
  '[Auth register] load user success',
  props<{ res: string }>()
);
export const loadUserFail = createAction(
  '[Auth register] load user fail',
  props<{ error: string }>()
);
