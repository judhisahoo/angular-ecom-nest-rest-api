/*import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { api } from '../../../lib/api/api';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        api.auth.login({ email: action.email, password: action.password }).pipe(
          map((response: any) =>
            AuthActions.loginSuccess({
              user: response.data.user,
              access_token: response.data.access_token,
            })
          ),
          catchError((error) => of(AuthActions.loginFail({ error })))
        )
      )
    )
  );
}*/
