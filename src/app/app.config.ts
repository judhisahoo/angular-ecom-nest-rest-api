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
import { provideState, provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { metaReducers } from './store/meta.reducer';
import { cartReducer } from './store/cart/cart.reducers';
import { CartEffects } from './store/cart/cart.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({ auth: authReducer, cart: cartReducer }, { metaReducers }), // Register your auth reducer
    //provideStore({}, { metaReducers }), // Register your auth reducer
    //provideState('auth', authReducer),
    //provideState('cart', cartReducer),
    provideEffects([CartEffects]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: false, // Restrict extension to log-only mode
    }),
  ],
};
