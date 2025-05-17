import { Component } from '@angular/core';
import { AppState } from '../Utils/app.state';
import { AuthService } from '../Services/auth.service';
import { login } from '../Utils/Actions/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone : false ,
})
export class AppComponent {

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Initialize auth state from localStorage
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const { userId, role } = JSON.parse(savedState);
        if (userId && role) {
          this.store.dispatch(login({ userId, role }));
        }
      } catch (error) {
        console.error('Error parsing saved state:', error);
        localStorage.removeItem('appState');
      }
    }
  }
}

