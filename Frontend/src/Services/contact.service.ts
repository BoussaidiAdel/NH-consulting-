import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { ContactFormData, ContactResponse } from '../Models/Contact';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/public/contact`; 
  
  constructor(private http: HttpClient) {}
  
  sendEmail(data: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/send`, data)
      .pipe(
        timeout(15000), 
        retry(1),
        catchError(this.handleError)
      );
  }

  subscribeToFormation(subscriptionData: any) {
    // subscriptionData must include formationTitle
    return this.http.post(`${this.apiUrl}/subscribe`, subscriptionData)
      .pipe(
        timeout(15000),
        retry(1),
        catchError(this.handleError)
      );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Client Error: ${error.error.message}`;
    } else {

      errorMessage = `Server Error: ${error.status} - ${error.statusText || ''} ${error.error?.message || ''}`;

      switch (error.status) {
        case 0:
          errorMessage = 'No connection to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = 'Invalid request data. Please check your form.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Our team has been notified.';
          break;
      }
    }
    
    console.error('Contact form error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}