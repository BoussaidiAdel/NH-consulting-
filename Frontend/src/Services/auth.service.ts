import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private userRole: string | null = null;

  constructor() {
    // Simulated session retrieval
    const storedStatus = localStorage.getItem('isLoggedIn');
    const storedRole = localStorage.getItem('userRole');

    this.loggedIn = storedStatus === 'true';
    this.userRole = storedRole;
  }

  login(role: string): void {
    this.loggedIn = true;
    this.userRole = role;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  }

  logout(): void {
    this.loggedIn = false;
    this.userRole = null;

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  }

  isUserLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUserRole(): string | null {
    return this.userRole;
  }
}
