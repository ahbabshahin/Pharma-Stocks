import { createAction, props } from '@ngrx/store';
import { EditRolePayload, ForgetPassword, User } from '../models/user.model';
import { Update } from '@ngrx/entity';

export const loadUsers = createAction(
  '[User] load users',
  props<{ params: { [key: string]: any }, isMore: boolean }>()
);
export const loadUsersSuccess = createAction(
  '[User] load users success',
  props<{ res: User[], total: number, isMore: boolean  }>()
);
export const loadUsersFail = createAction(
  '[User] load users fail',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[User] update user',
  props<{ payload: User }>()
);
export const updateUserSuccess = createAction(
  '[User] update user success',
  props<{ res: Update<User> }>()
);
export const updateUserFail = createAction(
  '[User] update user fail',
  props<{ error: string }>()
);

export const editRole = createAction(
  '[User] edit role',
  props<{ payload: EditRolePayload }>()
);
export const editRoleSuccess = createAction(
  '[User] edit role success',
  props<{ res: Update<User> }>()
);
export const editRoleFail = createAction(
  '[User] edit role fail',
  props<{ error: string }>()
);

export const deleteUser = createAction(
  '[User] delete user',
  props<{ id: string }>()
);
export const deleteUserSuccess = createAction(
  '[User] delete user success',
  props<{ id: string }>()
);
export const deleteUserFail = createAction(
  '[User] delete user fail',
  props<{ error: string }>()
);

export const forgetPassword = createAction(
  '[User forget password] forget password',
  props<{ payload: ForgetPassword }>()
);
export const forgetPasswordSuccess = createAction(
  '[User forget password] forget password success',
  props<{ res: Update<User> }>()
);
export const forgetPasswordError = createAction(
  '[User forget password] forget password fail',
  props<{ error: string }>()
);
