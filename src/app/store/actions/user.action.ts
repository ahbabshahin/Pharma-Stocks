import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';
import { Update } from '@ngrx/entity';

export const loadUsers = createAction(
  '[User] load users',
  props<{ params: { [key: string]: any } }>()
);
export const loadUsersSuccess = createAction(
  '[User] load users success',
  props<{ res: User[] }>()
);
export const loadUsersFail = createAction(
  '[User] load users fail',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[User] update user',
  props<{ user: User }>()
);
export const updateUserSuccess = createAction(
  '[User] update user success',
  props<{ user: Update<User> }>()
);
export const updateUserFail = createAction(
  '[User] update user fail',
  props<{ error: string }>()
);

export const editRole = createAction(
  '[User] edit role',
  props<{ user: User }>()
);
export const editRoleSuccess = createAction(
  '[User] edit role success',
  props<{ user: Update<User> }>()
);
export const editRoleFail = createAction(
  '[User] edit role fail',
  props<{ error: string }>()
);
