import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../store/auth/auth.selectors';
import { User } from '../../models/user.model';
import { api, updateProfileSchema } from '../../../lib/api/api';
import { z } from 'zod';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  getLocalStorageWithExpiration,
  setLocalStorageWithExpiration,
  removeLocalStorageItem,
} from '../../../lib/helper/storage';

import { loginSuccess } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  // Form data bound to the template
  formData = {
    name: '',
    email: '',
    age: 0,
    phone: '',
    dob: '',
  };

  // Errors for the form
  errors: z.ZodFormattedError<z.infer<typeof updateProfileSchema>> | null =
    null;

  // API error message
  apiError: string | null = null;

  // Success message
  successMessage: string | null = null;

  // Loading states
  isLoading = false;
  isDataLoading = true;
  dataLoadedSuccessfully = false;

  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  // For direct access to user data
  currentUser: User | null = null;

  // Debug information
  debugMessages: string[] = [];
  loadingSources: string[] = [];

  private subscription = new Subscription();
  private dataLoadAttempted = false;
  private storeDataReceived = false;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);

    this.addDebugMessage('Component initialized');
  }

  ngOnInit(): void {
    this.addDebugMessage('ngOnInit started');

    // PRIORITY 1: Try to load from storage immediately (synchronous)
    if (this.loadFromStorageSync()) {
      this.addDebugMessage(
        'Data loaded from storage - stopping other attempts'
      );
      return;
    }

    // PRIORITY 2: Subscribe to store but prevent overwriting good data
    this.subscription.add(
      this.currentUser$.subscribe((user) => {
        this.storeDataReceived = true;
        this.addDebugMessage(`Store emitted user: ${user ? 'Yes' : 'No'}`);

        // Only use store data if we haven't loaded data yet, or if it's better data
        if (
          !this.dataLoadedSuccessfully &&
          user &&
          this.hasRequiredFields(user)
        ) {
          this.handleUserDataLoaded(user, 'NgRx Store');
        } else if (!user && !this.dataLoadedSuccessfully) {
          this.addDebugMessage('Store emitted null/undefined user');
          // Try other sources after a delay to let store settle
          setTimeout(() => {
            if (!this.dataLoadedSuccessfully) {
              this.tryAlternativeSources();
            }
          }, 500);
        }
      })
    );

    // PRIORITY 3: Fallback after delay if nothing worked
    setTimeout(() => {
      if (!this.dataLoadedSuccessfully) {
        this.addDebugMessage('Fallback: No data loaded after 2 seconds');
        this.tryAlternativeSources();
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private addDebugMessage(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.debugMessages.push(`[${timestamp}] ${message}`);
    console.log(`[UpdateProfile] ${message}`);
  }

  private hasRequiredFields(user: any): boolean {
    return !!(user && (user.id || user._id || user.userId) && user.email);
  }

  // PRIORITY 1: Synchronous storage load
  private loadFromStorageSync(): boolean {
    this.addDebugMessage('Attempting synchronous storage load...');

    try {
      const possibleKeys = [
        'user',
        'userData',
        'currentUser',
        'userProfile',
        'authUser',
      ];

      for (const key of possibleKeys) {
        const userData = getLocalStorageWithExpiration(key);
        if (userData && this.hasRequiredFields(userData)) {
          this.addDebugMessage(`✓ Found valid user data in storage: ${key}`);
          this.handleUserDataLoaded(userData, `Storage (${key})`);
          return true;
        } else if (userData) {
          this.addDebugMessage(`⚠ Found incomplete data in storage: ${key}`);
        }
      }

      this.addDebugMessage('No valid user data in storage');
      return false;
    } catch (error) {
      this.addDebugMessage(`Storage load error: ${error}`);
      return false;
    }
  }

  // PRIORITY 3: Alternative sources
  private async tryAlternativeSources(): Promise<void> {
    this.addDebugMessage('Trying alternative data sources...');

    if (this.dataLoadedSuccessfully) {
      this.addDebugMessage('Data already loaded, skipping alternatives');
      return;
    }

    // Try AuthService
    if (this.authService.getCurrentUser) {
      try {
        const user = await this.authService.getCurrentUser();
        if (user && this.hasRequiredFields(user)) {
          this.addDebugMessage('✓ Found user data from AuthService');
          this.handleUserDataLoaded(user, 'AuthService');
          return;
        }
      } catch (error) {
        this.addDebugMessage(`AuthService error: ${error}`);
      }
    }

    // Try token decoding as last resort
    this.tryTokenDecoding();
  }

  private tryTokenDecoding(): void {
    this.addDebugMessage('Trying token decoding as last resort...');

    try {
      const token =
        getLocalStorageWithExpiration('token') ||
        getLocalStorageWithExpiration('authToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const mockUser = {
          id: payload.id || payload.userId || payload.sub,
          email: payload.email,
          name: payload.name || '',
          phone: payload.phone || '',
          age: payload.age || 0,
          dob: payload.dob || '',
        };

        if (this.hasRequiredFields(mockUser)) {
          this.addDebugMessage('✓ Created user from token');
          this.handleUserDataLoaded(mockUser, 'Token Decode');
        }
      }
    } catch (error) {
      this.addDebugMessage(`Token decode error: ${error}`);
      this.showNoDataError();
    }
  }

  private showNoDataError(): void {
    this.isDataLoading = false;
    this.apiError =
      'Unable to load your profile data. Please try logging out and logging back in.';
  }

  private handleUserDataLoaded(user: any, source: string): void {
    if (this.dataLoadedSuccessfully) {
      this.addDebugMessage(`Ignoring data from ${source} - already loaded`);
      return;
    }

    this.addDebugMessage(`✓ Loading user data from: ${source}`);
    this.addDebugMessage(`User ID: ${user.id || user._id || user.userId}`);

    this.currentUser = user;
    this.dataLoadedSuccessfully = true;
    this.isDataLoading = false;

    // Populate form with a small delay to ensure DOM is ready
    setTimeout(() => {
      this.populateFormData(user);
    }, 100);

    // Clear any previous errors
    this.apiError = null;
    this.loadingSources.push(source);
  }

  private populateFormData(user: User): void {
    if (!user) {
      this.addDebugMessage('Cannot populate form - no user data');
      return;
    }

    this.addDebugMessage('Populating form data...');

    try {
      const newFormData = {
        name: user.name || '',
        email: user.email || '',
        age: user.age || 0,
        phone: user.phone || '',
        dob: user.dob ? this.formatDateForInput(user.dob) : '',
      };

      this.formData = newFormData;
      this.addDebugMessage(`✓ Form populated successfully`);
      this.addDebugMessage(
        `Form data: name=${this.formData.name}, email=${this.formData.email}`
      );
    } catch (error) {
      this.addDebugMessage(`Error populating form: ${error}`);
    }
  }

  private formatDateForInput(date: string | Date | undefined | null): string {
    if (!date) return '';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';

      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  // Helper methods for template
  getErrorMessage(
    field: 'name' | 'email' | 'age' | 'phone' | 'dob'
  ): string | null {
    return this.errors?.[field]?._errors?.[0] || null;
  }

  hasError(field: 'name' | 'email' | 'age' | 'phone' | 'dob'): boolean {
    return !!(
      this.errors?.[field]?._errors && this.errors[field]._errors.length > 0
    );
  }

  private clearMessages(): void {
    this.errors = null;
    this.apiError = null;
    this.successMessage = null;
  }

  // Debug method for template
  showDebugInfo(): void {
    console.log('=== DEBUG INFO ===');
    console.log('Debug Messages:', this.debugMessages);
    console.log('Current User:', this.currentUser);
    console.log('Form Data:', this.formData);
    console.log('Data Loaded Successfully:', this.dataLoadedSuccessfully);
    console.log('Loading Sources Used:', this.loadingSources);
    console.log('Store Data Received:', this.storeDataReceived);

    // Check all possible storage keys
    const allKeys = [
      'user',
      'userData',
      'currentUser',
      'userProfile',
      'authUser',
      'token',
      'authToken',
    ];
    console.log('=== STORAGE CONTENTS ===');
    allKeys.forEach((key) => {
      const value = getLocalStorageWithExpiration(key);
      console.log(`Storage[${key}]:`, value);
    });
  }

  // Force reload data (ignoring current state)
  forceReloadData(): void {
    this.addDebugMessage('=== FORCE RELOAD INITIATED ===');
    this.dataLoadedSuccessfully = false;
    this.isDataLoading = true;
    this.currentUser = null;
    this.formData = { name: '', email: '', age: 0, phone: '', dob: '' };
    this.debugMessages = [];

    // Try storage first
    if (!this.loadFromStorageSync()) {
      // Try alternative sources
      setTimeout(() => {
        this.tryAlternativeSources();
      }, 500);
    }
  }

  // Add this helper method to your component class
  private getUserId(user: User | any): string | null {
    if (!user) return null;

    // Try different possible ID fields
    return user.id || user._id || user.userId || null;
  }

  // Replace the problematic getUserId logic in your onSubmit method with this:

  async onSubmit(): Promise<void> {
    try {
      this.clearMessages();
      this.isLoading = true;
      this.addDebugMessage('Form submission started');

      // Validate we have user data
      if (!this.currentUser) {
        throw new Error('No user data available for update');
      } else {
        console.log('this.currentUser in onsubmit ::', this.currentUser);
      }

      // Get user ID from various possible sources - FIXED VERSION
      let userId =
        this.currentUser.id ||
        (this.currentUser as any)._id ||
        (this.currentUser as any).userId;

      if (!userId) {
        console.error('User object:', this.currentUser);
        console.error('Available keys:', Object.keys(this.currentUser));
        throw new Error(
          `No user ID found. Available keys: ${Object.keys(
            this.currentUser
          ).join(', ')}`
        );
      }

      this.addDebugMessage(`Using user ID: ${userId}`);

      // Validate form data
      const validatedData = updateProfileSchema.parse(this.formData);
      this.addDebugMessage('Form validation passed');

      // Make API call
      const response = await api.auth.updateProfile(userId, validatedData);
      console.log('response after updateProfile ::', response);

      setLocalStorageWithExpiration('user', response.data.user, 1);
      const tmpToken = getLocalStorageWithExpiration('token');

      this.store.dispatch(
        loginSuccess({ user: response.data.user, access_token: tmpToken })
      );

      this.addDebugMessage('Profile update successful');

      this.successMessage = 'Profile updated successfully!';

      // Navigate after delay
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
    } catch (error: any) {
      this.addDebugMessage(`Form submission error: ${error.message}`);

      if (error instanceof z.ZodError) {
        this.errors = error.format();
      } else {
        this.apiError = error.message || 'An error occurred during update';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
