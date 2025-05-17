import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for authentication endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    // All other requests continue with error handling
    return next.handle(request).pipe(
      catchError(error => {
        console.error('HTTP Error:', error);
        if (error instanceof HttpErrorResponse && 
            error.status === 401 && 
            error.error?.error === 'token_expired') {
            console.error('Token expired, attempting to refresh...');
          // Token expired, try to refresh
          return this.handleTokenExpired(request, next);
        }
        
        // For other errors, pass through
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/login') || 
           url.includes('/api/auth/register') || 
           url.includes('/api/auth/refresh') ||
           url.includes('/api/auth/forget-password');
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(true);
          
          // Retry the original request now that we have a new token
          return next.handle(request);
        }),
        catchError((refreshError) => {
          this.isRefreshing = false;
          
          // If refresh fails, logout user
          this.authService.logout();
          return throwError(() => refreshError);
        })
      );
    } else {
      // If refresh is already happening, wait until it completes
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(request))
      );
    }
  }
}