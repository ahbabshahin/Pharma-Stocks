import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userStateName } from "../app.state";
import { userAdapter, UserState } from "../reducers/user.reducer";

export const getUserState = createFeatureSelector<UserState>(userStateName);

export const getUserLoader = createSelector(
  getUserState,
  (state: UserState) => state.loader
);

export const getUserSubLoader = createSelector(
  getUserState,
  (state: UserState) => state.subLoader
);

export const getUserLoaded = createSelector(
  getUserState,
  (state: UserState) => state.loaded
);

export const getTotalUser = createSelector(
  getUserState,
  (state: UserState) => state.total
);

export const getUserError = createSelector(
  getUserState,
  (state: UserState) => state.error
);

export const getUsers = createSelector(
  getUserState,
  userAdapter.getSelectors().selectAll
)
