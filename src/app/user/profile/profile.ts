import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../store/auth/auth.selectors'; // '../store/auth/auth.selectors';
import { User } from '../../models/user.model'; // Make sure this import is correct
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  // Observables for user data from NgRx store
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  // For direct access to user data if needed
  currentUser: User | null = null;

  private subscription = new Subscription();

  constructor(private authService: AuthService, private store: Store) {
    // Get user data from NgRx store
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Subscribe to user data for direct access in template
    this.subscription.add(
      this.currentUser$.subscribe((user) => {
        this.currentUser = user;
        console.log('Profile - Current user:', user);
      })
    );

    // Check token validity and refresh user data if needed
    if (this.authService.checkTokenValidity) {
      this.authService.checkTokenValidity();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Helper method to format date
  formatDate(date: string | Date | undefined | null): string {
    if (!date) return 'N/A';
    try {
      // The new Date() constructor can handle both strings and Date objects
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  }

  // Helper method to get user initials
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

  // Helper method to get full name
  getFullName(): string {
    if (!this.currentUser) return 'User';

    if (this.currentUser.name) {
      return this.currentUser.name;
    } else if (this.currentUser.email) {
      return this.currentUser.email.split('@')[0];
    }

    return 'User';
  }
}
