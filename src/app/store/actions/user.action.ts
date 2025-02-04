import {createAction, props} from '@ngrx/store';
import {User} from '../models/user.model';
export const loadUsers = createAction('[User] load users', props<{params: {[key: string]: any}}>());
export const loadUsersSuccess = createAction('[User] load users success', props<{res: User[]}>());
export const loadUsersFail = createAction('[User] load users fail', props<{error:string}>());
