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

  // Loading state
  isLoading = false;

  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  // For direct access to user data if needed
  currentUser: User | null = null;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    // Get user data from NgRx store
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Check if user is authenticated first
    this.subscription.add(
      this.isAuthenticated$.subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log('User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return;
        }
      })
    );

    // Subscribe to user data for direct access in template
    this.subscription.add(
      this.currentUser$.subscribe((user) => {
        console.log('Profile - Current user:', user);

        if (user) {
          this.currentUser = user;
          // Populate the form fields with the current user's data
          this.populateFormData(user);
        } else {
          // If no user data, try to refresh from server
          this.refreshUserData();
        }
      })
    );

    // Check token validity and refresh user data if needed
    this.refreshUserData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Populate form data from user object
   */
  private populateFormData(user: User): void {
    this.formData = {
      name: user.name || '',
      email: user.email || '',
      age: user.age || 0,
      phone: user.phone || '',
      dob: user.dob ? this.formatDateForInput(user.dob) : '',
    };
  }

  /**
   * Refresh user data from server
   */
  private refreshUserData(): void {
    if (this.authService.checkTokenValidity) {
      try {
        this.authService.checkTokenValidity();
      } catch (error) {
        console.error('Error refreshing user data:', error);
        this.apiError = 'Failed to load user data';
      }
    }
  }

  /**
   * Format date for HTML date input (YYYY-MM-DD)
   */
  private formatDateForInput(date: string | Date | undefined | null): string {
    if (!date) return '';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';

      // Format as YYYY-MM-DD for HTML date input
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  /**
   * Helper method to format date for display
   */
  formatDate(date: string | Date | undefined | null): string {
    if (!date) return 'N/A';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';

      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  /**
   * Helper method to get user initials
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'U';

    if (this.currentUser.name) {
      const nameParts = this.currentUser.name.split(' ');
      return nameParts
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (this.currentUser.email) {
      return this.currentUser.email.charAt(0).toUpperCase();
    }

    return 'U';
  }

  /**
   * Helper method to get full name
   */
  getFullName(): string {
    if (!this.currentUser) return 'User';

    if (this.currentUser.name) {
      return this.currentUser.name;
    } else if (this.currentUser.email) {
      return this.currentUser.email.split('@')[0];
    }

    return 'User';
  }

  /**
   * Helper method to get error message safely
   */
  getErrorMessage(
    field: 'name' | 'email' | 'age' | 'phone' | 'dob'
  ): string | null {
    return this.errors?.[field]?._errors?.[0] || null;
  }

  /**
   * Helper method to check if field has errors
   */
  hasError(field: 'name' | 'email' | 'age' | 'phone' | 'dob'): boolean {
    return !!(
      this.errors?.[field]?._errors && this.errors[field]._errors.length > 0
    );
  }

  /**
   * Clear all messages
   */
  private clearMessages(): void {
    this.errors = null;
    this.apiError = null;
    this.successMessage = null;
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    try {
      // Clear previous messages and set loading state
      this.clearMessages();
      this.isLoading = true;

      // Ensure the current user exists before making the API call
      if (!this.currentUser || !this.currentUser.id) {
        this.apiError =
          'User data is not available. Please try refreshing the page. 1111';
        return;
      }
      console.log('kkkk');

      // Validate form data with Zod
      const validatedData = updateProfileSchema.parse(this.formData);
      console.log('Form validation passed:', validatedData);

      // Call the API to update profile
      const response = await api.auth.updateProfile(
        this.currentUser.id,
        validatedData
      );

      console.log('Profile update response:', response);

      // Show success message
      this.successMessage = 'Profile updated successfully!';

      // Optionally update the store with new user data
      // You might want to dispatch an action to update the user in the store
      // this.store.dispatch(updateUserProfile({ user: response.data }));

      // Navigate to profile page after a short delay
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
    } catch (error: any) {
      console.log('catch part');
      console.error('Profile update error:', error);

      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        this.errors = error.format();
        console.error('Validation errors:', this.errors);
      } else {
        // Handle API errors
        if (error.response?.data?.message) {
          // API returned an error response
          this.apiError = error.response.data.message;
        } else if (error.message) {
          // Handle other errors with message
          this.apiError = error.message;
        } else {
          // Network or other errors
          this.apiError = 'Unable to connect to server. Please try again.';
        }

        console.error('API error:', error.response?.data || error.message);
      }
    } finally {
      // Always reset loading state
      this.isLoading = false;
    }
  }

  /**
   * Handle form reset
   */
  onReset(): void {
    if (this.currentUser) {
      this.populateFormData(this.currentUser);
      this.clearMessages();
    }
  }
}
