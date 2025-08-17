import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector for the auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors for individual properties
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.user && !!state.access_token
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.access_token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
