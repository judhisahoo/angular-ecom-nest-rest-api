import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, access_token }) => ({
    ...state,
    user,
    access_token,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loginFail, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }))
);
