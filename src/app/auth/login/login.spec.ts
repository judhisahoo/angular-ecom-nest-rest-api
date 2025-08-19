// src/app/auth/login/login.spec.ts
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../auth';
import { of } from 'rxjs';

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
});
