// services/formation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Formation } from '../Models/Formation';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = `${environment.apiUrl}/public/formations`;

  constructor(private http: HttpClient) {}

  getAllFormations(sortBy?: string): Observable<Formation[]> {
    const url = sortBy ? `${this.apiUrl}?sortBy=${sortBy}` : this.apiUrl;
    return this.http.get<Formation[]>(url).pipe(
      catchError(this.handleError<Formation[]>('getAllFormations', []))
    );
  }

  getFormation(id: string): Observable<Formation> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Formation>(url).pipe(
      catchError(this.handleError<Formation>(`getFormation id=${id}`))
    );
  }

  addFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/add`, formation);
  }

  updateFormation(formation: Formation): Observable<Formation> {
    const url = `${this.apiUrl}/${formation.id}`;
    return this.http.put<Formation>(url, formation).pipe(
      tap(_ => console.log(`Formation updated successfully id=${formation.id}`)),
      catchError(this.handleError<Formation>('updateFormation'))
    );
  }

  deleteFormation(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(_ => console.log(`Formation deleted successfully id=${id}`)),
      catchError(this.handleError<void>('deleteFormation'))
    );
  }
  

  searchFormations(keyword: string): Observable<Formation[]> {
    const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
    return this.http.get<Formation[]>(url).pipe(
      catchError(this.handleError<Formation[]>('searchFormations', []))
    );
  }

  subscribeToFormation(subscriptionData: any) {
    return this.http.post(`${this.apiUrl}/formations/subscribe`, subscriptionData);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        if (error.error && error.error.message) {
          errorMessage += `\nDetails: ${error.error.message}`;
        }
      }

      console.error(`${operation} failed: ${errorMessage}`);
      return throwError(() => new Error(errorMessage));
    };
  }
}
