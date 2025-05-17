import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectSelectedLanguage } from '../../Utils/Selectors/language.selectors';
import { setLanguage } from '../../Utils/Actions/language.actions';
import { AuthService } from '../../Services/auth.service';
import { selectAuthState, selectUserID, selectUserRole } from '../../Utils/Selectors/auth.selectors';
import { AppState, AuthState } from '../../Utils/app.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  currentLanguage: string = 'en';
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  authState$: Observable<AuthState>;
  userRole$: Observable<string | null>;
  isLoggedIn$: Observable<boolean>;
  // New properties for forgot password
  isForgotPasswordView: boolean = false;
  resetEmail: string = '';
  resetMessage: string = '';
  userId$: Observable<string | null>;
  userId: string | null = null;

  constructor(
    private store: Store<AppState>, 
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.authState$ = this.store.select(selectAuthState);
    this.userRole$ = this.store.pipe(select(selectUserRole));
    this.userId$ = this.store.pipe(select(selectUserID));
    this.isLoggedIn$ = this.userRole$.pipe(
      map(role => role !== null)
    );
  }

  ngOnInit(): void {
    this.store.select(selectSelectedLanguage).subscribe(language => {
      this.currentLanguage = language;
    });
    
    this.authState$.subscribe(state => {
      console.log('AuthState updated:', state);
    });
    
    this.userId$.subscribe(id => {
      this.userId = id;
    });
  }

  isLoggedIn(role: Observable<string | null>): Observable<boolean> {
    return role.pipe(
      map(role => role !== null)
    );
  }
  
  onResetPassword(event: Event): void {
    this.preventDropdownClose(event);
    
    if (!this.resetEmail) {
      this.resetMessage = 'Please enter your email address.';
      return;
    }
    
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: () => {
        this.resetMessage = 'Password reset link sent to your email.';
      },
      error: (err) => {
        console.error('Password reset failed', err);
        this.resetMessage = 'Failed to send reset link. Please try again.';
      }
    });
  }

  showForgotPasswordView(event: Event): void {
    this.preventDropdownClose(event);
    this.isForgotPasswordView = true;
    this.resetMessage = '';
  }

  showLoginView(event: Event): void {
    this.preventDropdownClose(event);
    this.isForgotPasswordView = false;
    this.resetEmail = '';
    this.resetMessage = '';
  }

  changeLanguage(lang: string): void {
    this.store.dispatch(setLanguage({ language: lang }));
    this.currentLanguage = lang;
  }

  onLogin(): void {
    const credentials = {
      email: this.email,
      password: this.password,
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        const { userId, role } = response;
        this.authService.saveState(userId, role);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearState();
        console.log('Logout successful');
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.authService.clearState();
      }
    });
  }

  preventDropdownClose(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}