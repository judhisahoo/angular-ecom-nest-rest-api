import { Component, OnInit } from '@angular/core';
import { registerSchema, RegisterFormInputs, api } from '../../../lib/api/api';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { z } from 'zod';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // Use definite assignment assertion

  apiError: string | null = null;
  isLoading: boolean = false;

  // Success message
  successMessage: string | null = null;

  // A new property to hold Zod's formatted validation errors
  errors: z.ZodFormattedError<RegisterFormInputs> | null = null;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      age: [null],
      dob: [''],
      password: [''],
      confirmPassword: [''],
    });
  }

  // A helper function to get Zod-defined error messages
  getErrorMessage(field: keyof RegisterFormInputs): string | null {
    // Check for errors on a specific field
    return this.errors?.[field]?._errors?.[0] || null;
  }

  async onSubmit(): Promise<void> {
    this.apiError = null;
    this.errors = null;
    this.isLoading = true;

    // Use Zod for validation on form submission
    try {
      // Cast the form value to the Zod-inferred type for proper validation
      const { confirmPassword, ...dataToSubmit } = registerSchema.parse(
        this.registerForm.value as RegisterFormInputs
      );

      // Add the new status property to the data
      const finalData = { ...dataToSubmit, status: true };

      // Add the new key 'status' with a value of true
      console.log('Form data validated by Zod:', finalData);

      const response = await api.auth.register(finalData);
      console.log('Registration successful:', response.data);
      this.successMessage = 'Registration successful.';

      // Navigate after delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        // Zod validation failed; format the errors and store them
        this.errors = error.format() as z.ZodFormattedError<RegisterFormInputs>;
        console.error('Validation errors:', this.errors);
      } else if (error.response && error.response.data) {
        // Handle API specific errors
        this.apiError =
          error.response.data.message ||
          'Registration failed. Please try again.';
      } else {
        // Handle network or unexpected errors
        this.apiError = 'An unexpected error occurred. Please try again later.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
