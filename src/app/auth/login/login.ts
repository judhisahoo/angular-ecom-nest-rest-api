import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { z } from 'zod';
import { loginSchema } from '../../../lib/api/api';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/auth/auth.actions';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  // Form data bound to the template
  formData = {
    email: '',
    password: '',
  };

  // Errors for the form
  errors: z.ZodFormattedError<z.infer<typeof loginSchema>> | null = null;

  // API error message
  apiError: string | null = null;

  // Loading state
  isLoading = false;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Helper method to get error message safely
  getErrorMessage(field: 'email' | 'password'): string | null {
    return this.errors?.[field]?._errors?.[0] || null;
  }

  // Helper method to check if field has errors
  hasError(field: 'email' | 'password'): boolean {
    return !!(
      this.errors?.[field]?._errors && this.errors[field]._errors.length > 0
    );
  }

  async onSubmit(): Promise<void> {
    try {
      // Reset errors and set loading state
      this.errors = null;
      this.apiError = null;
      this.isLoading = true;

      // Validate form data with Zod
      const validatedData = loginSchema.parse(this.formData);
      console.log('Form validation passed:', validatedData);

      // Call the AuthService login method
      const { user, access_token } = await this.authService.login(
        this.formData.email,
        this.formData.password
      );

      console.log('Login successful!');
      console.log('user data from response :::', user);
      console.log('access_token data from response :::', access_token);

      // On successful login, dispatch success action
      this.store.dispatch(loginSuccess({ user, access_token }));

      // Navigate to dashboard or wherever you want after login
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Login error:', error);

      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        this.errors = error.format();
        console.error('Validation errors:', this.errors);
      } else {
        // Handle API errors
        if (error.response && error.response.data) {
          // API returned an error response
          this.apiError =
            error.response.data.message || 'An error occurred during login';
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
}
