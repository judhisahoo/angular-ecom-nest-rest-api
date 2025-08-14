import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
//import { provideEffects } from '@ngrx/effects';
//import { AuthEffects } from './store/auth/auth.effects';
import { metaReducers } from './store/meta.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({ auth: authReducer }, { metaReducers }), // Register your auth reducer
    //provideEffects([AuthEffects]), // Register your effects
  ],
};
