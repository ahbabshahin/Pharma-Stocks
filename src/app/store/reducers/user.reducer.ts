import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../models/user.model";
import { createReducer } from "@ngrx/store";

export interface UserState extends EntityState<User>{
  loader: boolean;
  loaded: boolean;
  subLoader: boolean;
  error: string;
}

const defaultUser: UserState = {
  ids: [],
  entities: {},
  loader: false,
  loaded: false,
  subLoader: false,
  error: "",
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter({
  selectId: (user: User) => user?._id as string
})

export const initialState: UserState = userAdapter.getInitialState(defaultUser);

const { selectAll } = userAdapter.getSelectors();

export const userReducer = createReducer(
  initialState,
);
