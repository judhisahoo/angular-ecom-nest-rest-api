import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  setLocalStorageWithExpiration,
  getLocalStorageWithExpiration,
  removeLocalStorageItem,
} from '../lib/helper/storage';
import { api } from '../lib/api/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isLoggedIn = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  private readonly _currentUser = new BehaviorSubject<any>(null);
  readonly currentUser$ = this._currentUser.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if token exists and is not expired
      const token = getLocalStorageWithExpiration('token');
      const user = getLocalStorageWithExpiration('user');

      if (token) {
        this._isLoggedIn.next(true);
        this._currentUser.next(user);
      } else {
        this._isLoggedIn.next(false);
        this._currentUser.next(null);
      }
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: any; access_token: string }> {
    try {
      console.log('now at auth service login fun');
      // Your actual login API call would go here
      // For now, this is a placeholder structure
      const response = await this.callLoginAPI(email, password);

      if (isPlatformBrowser(this.platformId)) {
        // Store token with 24 hours expiration (you can adjust this)
        setLocalStorageWithExpiration('token', response.access_token, 24);

        // Store user data with same expiration
        setLocalStorageWithExpiration('user', response.user, 24);

        // Update observables
        this._isLoggedIn.next(true);
        this._currentUser.next(response.user);
      }

      return response;
    } catch (error) {
      this._isLoggedIn.next(false);
      this._currentUser.next(null);
      throw error;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove token and user data using your custom storage helper
      removeLocalStorageItem('token');
      removeLocalStorageItem('user');

      // Update observables
      this._isLoggedIn.next(false);
      this._currentUser.next(null);
    }
  }

  // Get the current token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return getLocalStorageWithExpiration('token');
    }
    return null;
  }

  // Get current user data
  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return getLocalStorageWithExpiration('user');
    }
    return null;
  }

  // Check if user is currently logged in
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = getLocalStorageWithExpiration('token');
      return !!token;
    }
    return false;
  }

  // Method to refresh token validity check
  checkTokenValidity(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = getLocalStorageWithExpiration('token');
      const user = getLocalStorageWithExpiration('user');

      if (token && user) {
        this._isLoggedIn.next(true);
        this._currentUser.next(user);
      } else {
        // Token expired or doesn't exist
        this._isLoggedIn.next(false);
        this._currentUser.next(null);
        this.logout(); // Clean up any remaining data
      }
    }
  }

  // Placeholder for your actual login API call
  private async callLoginAPI(
    email: string,
    password: string
  ): Promise<{ user: any; access_token: string }> {
    console.log('now at auth service callLoginAPI fun');
    // Replace this with your actual API call
    // This is just a placeholder structure

    // Example using fetch (replace with your actual API implementation):
    const response = await api.auth.login({ email, password });

    return response.data;
  }
}
