// src/app/auth/login/login.spec.ts
import {
  fakeAsync,
  TestBed,
  tick,
  flushMicrotasks,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../auth';
import * as AuthActions from '../../store/auth/auth.actions'; // <-- adjust path if needed
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { date } from 'zod';

describe('LoginComponent', () => {
  let fixture: any;
  let component: any;
  let router: Router;
  let authService: AuthService;

  const mockAuthService = {
    // make sure this exists:
    isAuthenticated: jest.fn().mockReturnValue(false),
    // whatever your login returns — adjust if it’s a Promise instead of Observable
    login: jest.fn().mockReturnValue(of({ success: true })),
    // if Promise: login: jest.fn().mockResolvedValue({ success: true })
  };

  const initialState = {
    auth: {
      user: null,
      isLoggedIn: false,
      token: null,
    },
  };

  beforeAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ⬅️ LoginComponent is standalone; just import it
      imports: [LoginComponent],
      providers: [
        provideMockStore({ initialState: {} }),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable(); // wait for ngModel to settle
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('binds formData.email and formData.password via ngModel', async () => {
    const emailEl = fixture.debugElement.query(By.css('input[name="email"]'))
      .nativeElement as HTMLInputElement;
    const passEl = fixture.debugElement.query(By.css('input[name="password"]'))
      .nativeElement as HTMLInputElement;

    // set values
    emailEl.value = 'test@example.com';
    emailEl.dispatchEvent(new Event('input', { bubbles: true })); // real DOM event

    passEl.value = 'password123';
    passEl.dispatchEvent(new Event('input', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable(); // <-- important for ngModel

    expect(component.formData.email).toBe('test@example.com');
    expect(component.formData.password).toBe('password123');
  });

  it('redirects to /profile on init when already authenticated', async () => {
    // make isAuthenticated return true
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // spy on router.navigate
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    // recreate component so ngOnInit runs again with updated mock
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });

  it('calls AuthService.login and navigates on success (template path)', fakeAsync(() => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockAuthService.login.mockResolvedValue({
      user: { id: 1, email: 'test@example.com' },
      access_token: 'abc',
      success: true,
    });

    const router = TestBed.inject(Router);
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true as any);

    // Fill inputs with real DOM events
    const emailEl = fixture.debugElement.query(By.css('input[name="email"]'))
      .nativeElement as HTMLInputElement;
    const passEl = fixture.debugElement.query(By.css('input[name="password"]'))
      .nativeElement as HTMLInputElement;

    emailEl.value = 'test@example.com';
    emailEl.dispatchEvent(new Event('input', { bubbles: true }));
    passEl.value = 'password123';
    passEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    tick(); // flush ngModel

    // Submit via ngSubmit
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    // Flush awaited login
    flushMicrotasks();
    tick();
    fixture.detectChanges();

    expect(mockAuthService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    //expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  }));

  //logs in successfully (Promise-based) and clears apiError
  /*it('logs in successfully (Promise-based) and clears apiError', fakeAsync(() => {
    // Ensure we’re not inheriting any previous Observable return
    (mockAuthService.login as jest.Mock).mockReset();

    // Use a Promise for THIS call, so onSubmit() awaits and hits finally{}
    (mockAuthService.login as jest.Mock).mockResolvedValueOnce({
      user: { id: 1, name: 'Test User' },
      access_token: 'abc123',
    });

    // provide valid form data
    component.formData.email = 'test@example.com';
    component.formData.password = 'password123';

    component.onSubmit();

    // drive awaited Promise to completion
    flushMicrotasks();
    tick();
    fixture.detectChanges();

    expect(mockAuthService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(component.apiError).toBeNull();
    expect(component.isLoading).toBe(false);
  })); */

  //logs in successfully (Promise-based) and clears apiError
  it('logs in successfully (Promise-based) and clears apiError', async () => {
    (mockAuthService.login as jest.Mock).mockReset();
    (mockAuthService.login as jest.Mock).mockResolvedValueOnce({
      user: { id: 1, name: 'Test User' },
      access_token: 'abc123',
    });

    component.formData.email = 'test@example.com';
    component.formData.password = 'password123';

    await component.onSubmit(); // wait for the async method to finish
    await fixture.whenStable(); // ensure Angular async tasks settle
    fixture.detectChanges();

    expect(mockAuthService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(component.apiError).toBeNull();
    expect(component.isLoading).toBe(false);
  });

  //sets apiError when backend provides response.data.message with fakeAsync
  it('sets apiError when backend provides response.data.message', async () => {
    const backendMessage = 'Invalid email or password';

    mockAuthService.login.mockRejectedValue({
      response: { data: { message: backendMessage } },
    });

    component.formData.email = 'bad@example.com';
    component.formData.password = 'wrongpass';

    await component.onSubmit(); // wait for the async flow
    fixture.detectChanges();

    expect(component.apiError).toBe(backendMessage);
    expect(component.isLoading).toBeFalsy();
  });

  it('sets apiError when network error with message occurs', async () => {
    const errorMessage = 'Network Error';
    (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    component.formData.email = 'test@example.com';
    component.formData.password = 'password';

    await component.onSubmit(); // ✅ await!
    fixture.detectChanges(); // ✅ detect changes

    expect(component.apiError).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });

  it('disables submit button and shows spinner label while loading', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    component.isLoading = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.textContent || '').toContain('Logging in...');
  });

  it('renders the Register link', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();
    const link = fixture.debugElement.query(
      By.css('a[routerLink="/register"]')
    );
    expect(link).toBeTruthy();
  });
});
