// services/formation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Formation } from '../Models/Formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:9000/api/formations';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl).pipe(
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
    return this.http.post<Formation>(`${this.apiUrl}/add`, formation).pipe(
      tap(_ => console.log('Formation added')),
      catchError(this.handleError<Formation>('addFormation'))
    );
  }

  updateFormation(formation: Formation): Observable<Formation> {
    const url = `${this.apiUrl}/${formation.id}`;
    return this.http.put<Formation>(url, formation).pipe(
      tap(_ => console.log(`Formation updated id=${formation.id}`)),
      catchError(this.handleError<Formation>('updateFormation'))
    );
  }

  deleteFormation(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(_ => console.log(`Formation deleted id=${id}`)),
      catchError(this.handleError<void>('deleteFormation'))
    );
  }

  getFormationsByEtat(etat: string): Observable<Formation[]> {
    const url = `${this.apiUrl}/etat/${etat}`;
    return this.http.get<Formation[]>(url).pipe(
      catchError(this.handleError<Formation[]>('getFormationsByEtat', []))
    );
  }

  getFormationsByNiveau(niveau: string): Observable<Formation[]> {
    const url = `${this.apiUrl}/niveau/${niveau}`;
    return this.http.get<Formation[]>(url).pipe(
      catchError(this.handleError<Formation[]>('getFormationsByNiveau', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
