// src/app/shared/header/header.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let mockAuthService: any;
  let mockRouter: any;

  // Create a BehaviorSubject to mock the isLoggedIn$ observable
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject(false);

    // Create mock AuthService and Router
    mockAuthService = {
      isLoggedIn$: isLoggedInSubject.asObservable(),
      currentUser$: new BehaviorSubject(null).asObservable(),
      checkTokenValidity: jest.fn(),
      logout: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test Case 1: Component Creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case 2: Initial state (User is logged out)
  it('should show login link when user is logged out', () => {
    // Initial state is logged out, handled by beforeEach
    fixture.detectChanges();
    const loginLink = fixture.debugElement.query(
      By.css('a[routerLink="/login"]')
    );
    const accountDropdown = fixture.debugElement.query(
      By.css('li.relative.group')
    );

    expect(loginLink).toBeTruthy();
    expect(accountDropdown).toBeFalsy();
  });

  // Test Case 3: Logged-in state
  it('should show "My Account" links and hide login link when user is logged in', () => {
    isLoggedInSubject.next(true);
    fixture.detectChanges();

    const loginLink = fixture.debugElement.query(
      By.css('a[routerLink="/login"]')
    );
    const addProductLink = fixture.debugElement.query(
      By.css('a[routerLink="/add-product"]')
    );
    const accountDropdown = fixture.debugElement.query(
      By.css('li.relative.group')
    );

    expect(loginLink).toBeFalsy();
    expect(addProductLink).toBeTruthy();
    expect(accountDropdown).toBeTruthy();
  });

  // Test Case 4: Logout functionality
  it('should call logout and navigate to home page', () => {
    component.logout();

    // Verify that the authService.logout() method was called
    expect(mockAuthService.logout).toHaveBeenCalled();

    // Verify that the router.navigate() method was called with the correct path
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  // Test Case 5: Dropdown toggle functionality
  it('should toggle the dropdown state', () => {
    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation');

    // Initial state should be false
    expect(component.isDropdownOpen).toBe(false);

    // Call toggleDropdown
    component.toggleDropdown(event);
    expect(component.isDropdownOpen).toBe(true);
    expect(event.stopPropagation).toHaveBeenCalled();

    // Call toggleDropdown again
    component.toggleDropdown(event);
    expect(component.isDropdownOpen).toBe(false);
  });
});
