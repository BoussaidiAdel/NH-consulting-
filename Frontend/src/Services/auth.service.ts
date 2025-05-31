import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../Utils/app.state';
import { login, logout } from '../Utils/Actions/auth.actions';
import { RegistreUser } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router , private store: Store<AppState>) {
    // Check if user is logged in when service initializes
    this.checkAuthStatus();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userRole$(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  getUserId(): string | null {
    return this.userId;
  }

  public  checkAuthStatus(): void {
    // Since we're using HttpOnly cookies, we need to make a request to the server
    // to check if the user is logged in
    this.refreshToken().subscribe({
      next: (response) => {
        if (response && response.id) {
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(response.role);
          this.userId = response.id;
        } else {
          this.isAuthenticatedSubject.next(false);
          this.userRoleSubject.next(null);
          this.userId = null;
        }
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
        this.userRoleSubject.next(null);
        this.userId = null;
      }
    });
  }

  register(user: RegistreUser): Observable<any> {
    return this.http.post<RegistreUser>(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response && response.id) {
            this.isAuthenticatedSubject.next(true);
            this.userRoleSubject.next(response.role);
            this.userId = response.id;
          }
        })
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response && response.id) {
            this.isAuthenticatedSubject.next(true);
            this.userRoleSubject.next(response.role);
            this.userId = response.id;
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.userRoleSubject.next(null);
          this.userId = null;
        })
      );
  }

  forgotPassword(email: string): Observable<any> {  
    return this.http.post(`${this.apiUrl}/forget-password`, { email });
  }

  clearState(): void {
    localStorage.removeItem('appState');
    this.store.dispatch(logout());
  }

   getState(): { userId: string; role: string } | null {
    const stateStr = localStorage.getItem('appState');
    if (!stateStr) return null;
    
    try {
      return JSON.parse(stateStr);
    } catch (e) {
      console.error('Failed to parse state from localStorage:', e);
      localStorage.removeItem('appState');
      return null;
    }
  }


  isLoggedIn(): boolean {
    return !!this.getState();
  }


  saveState(userId: string, role: string): void {
    const state = { userId, role };
    localStorage.setItem('appState', JSON.stringify(state));
    this.store.dispatch(login({ userId, role }));
  }


}