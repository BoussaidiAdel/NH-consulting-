import { createSelector } from '@ngrx/store';
import { AppState, AuthState } from '../app.state';

export const selectAuthState = (state: AppState) => state.auth;

export const selectUserRole = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.role
);

export const selectUserID = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.userId
);