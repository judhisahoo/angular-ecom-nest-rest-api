import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthState, initialState } from './auth/auth.state';
import * as AuthActions from './auth/auth.actions';
import {
  setLocalStorageWithExpiration,
  getLocalStorageWithExpiration,
} from '../../lib/helper/storage';

const TOKEN_EXPIRY_HOURS = 24;

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return function (state: any, action: Action): any {
    // Hydrate the state from localStorage on application load
    if (
      action.type === '@ngrx/store/init' ||
      action.type === '@ngrx/store/update-reducers'
    ) {
      const storedToken = getLocalStorageWithExpiration('token');
      const storedUser = getLocalStorageWithExpiration('user');

      if (storedToken && storedUser) {
        const authState: AuthState = {
          ...initialState,
          access_token: storedToken,
          user: JSON.parse(storedUser),
        };

        return {
          ...state,
          auth: authState,
        };
      }
    }

    const nextState = reducer(state, action);

    // Persist the state to localStorage on specific actions
    if (action.type === AuthActions.loginSuccess.type) {
      setLocalStorageWithExpiration(
        'token',
        nextState.auth.access_token,
        TOKEN_EXPIRY_HOURS
      );
      setLocalStorageWithExpiration(
        'user',
        JSON.stringify(nextState.auth.user),
        TOKEN_EXPIRY_HOURS
      );
    } else if (action.type === AuthActions.logout.type) {
      //localStorage.removeItem('token');
      //localStorage.removeItem('user');
    }

    return nextState;
  };
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];
