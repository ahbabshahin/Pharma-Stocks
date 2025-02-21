import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../models/user.model";
import { createReducer, on } from "@ngrx/store";
import * as userActions from "../actions/user.action";

export interface UserState extends EntityState<User>{
  loader: boolean;
  loaded: boolean;
  subLoader: boolean;
  total: number;
  error: string;
}

const defaultUser: UserState = {
  ids: [],
  entities: {},
  loader: false,
  loaded: false,
  subLoader: false,
  total: 0,
  error: "",
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter({
  selectId: (user: User) => user?._id as string
})

export const initialState: UserState = userAdapter.getInitialState(defaultUser);

const { selectAll } = userAdapter.getSelectors();

export const userReducer = createReducer(
  initialState,
  on(userActions.loadUsers, (state, action) =>{
    return{
      ...state,
      loader: !action.isMore,
      loaded: action.isMore
    }
  }),
  on(userActions.loadUsersSuccess, (state, action) => {
    let response = action.res;
    if(action.isMore) response = [...selectAll(state), ...action.res];
    return userAdapter.addMany(response, {
      ...state,
      loader: false,
      loaded: true,
    });
  }),
  on(userActions.loadUsersFail, (state, action) => {
    return  {
      ...state,
      error: action.error,
      loader: false,
      loaded: false,
    };
  }),
  on(userActions.updateUserSuccess, (state, action) =>{
    return userAdapter.updateOne(action.res, state)
  }),
  on(userActions.updateUserFail, (state, action) =>{
    return  {
     ...state,
      error: action.error,
    };
  }),
  on(userActions.editRoleSuccess, (state, action) =>{
    return userAdapter.updateOne(action.res, state)
  }),
  on(userActions.editRoleFail, (state, action) =>{
    return  {
     ...state,
      error: action.error,
    };
  }),
  on(userActions.deleteUserSuccess, (state, action) =>{
    return userAdapter.removeOne(action.id, state)
  }),
  on(userActions.deleteUserFail, (state, action) =>{
    return  {
     ...state,
      error: action.error,
    };
  })

);
