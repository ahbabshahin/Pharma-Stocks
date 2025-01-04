import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authAdapter, AuthState } from "../reducers/auth.reducer";
import { authStateName } from "../app.state";

export const getAuthState = createFeatureSelector<AuthState>(authStateName);

export const getAccessToken = createSelector(
  getAuthState,
  (state: AuthState) => state.accessToken
);

export const getUserRole = createSelector(
  getAuthState,
  (state: AuthState) => state.userRole
)

export const getUser = createSelector(
  getAuthState,
  authAdapter.getSelectors().selectAll
);
