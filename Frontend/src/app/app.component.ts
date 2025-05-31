import { Component, OnInit } from '@angular/core';
import { AppState } from '../Utils/app.state';
import { AuthService } from '../Services/auth.service';
import { login } from '../Utils/Actions/auth.actions';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../Utils/Selectors/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>, private authService: AuthService) {}

  ngOnInit(): void {
    // Check if there's a saved state in localStorage
    const savedState = this.authService.getState();
    
    if (savedState) {
      // If there's a saved state, dispatch the login action to restore it
      this.store.dispatch(login({ 
        userId: savedState.userId, 
        role: savedState.role 
      }));
    }

    // Check authentication status from the server
    this.authService.checkAuthStatus();
  }
}

