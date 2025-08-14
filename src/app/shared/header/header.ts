import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'], // or styleUrl if using single file
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<any>;
  private subscription: Subscription = new Subscription();

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

  logout(): void {
    this.authService.logout();
    // Redirect to home page after logout
    this.router.navigate(['/']);
  }
}
