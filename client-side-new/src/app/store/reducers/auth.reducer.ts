import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../models/user.model";
import { createReducer, on } from "@ngrx/store";
import * as authActions from '../../store/actions/auth.action';

export interface AuthState extends EntityState<User>{
  loader: boolean,
  loaded: boolean,
  accessToken: string,
  error: string,
}

export const defaultAuthInitialState: AuthState = {
  ids: [],
  entities: {},
  loader: false,
  loaded: false,
  accessToken: '',
  error: "",
}

export const authAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user._id as string,
});

export const initialState: AuthState = authAdapter.getInitialState(defaultAuthInitialState);

export const authReducer = createReducer(
  initialState,
  on(authActions.loginSuccess, (state, action) =>{
    return {
      ...state,
      accessToken: action.res
    }
  }),
  on(authActions.loginFail, (state, action) =>{
    return{
      ...state,
      error: action.error
    }
  }),
  on(authActions.loadUserSuccess, (state, action) =>{
    return authAdapter.setOne(action.res, state);
  }),
  on(authActions.loadUserFail, (state, action) =>{
    return {
      ...state,
      error: action.error
    };
  }),
)
