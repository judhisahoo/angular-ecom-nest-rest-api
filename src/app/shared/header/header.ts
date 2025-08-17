import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<any>;
  private subscription: Subscription = new Subscription();

  // For managing dropdown state if needed
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Check token validity when component initializes
    this.authService.checkTokenValidity();

    // Optional: Subscribe to auth state changes for debugging
    this.subscription.add(
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        console.log('Header - Login state changed:', isLoggedIn);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Close dropdown when clicking outside (optional enhancement)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isDropdownOpen = false;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    // Redirect to home page after logout
    this.router.navigate(['/']);
  }
}
