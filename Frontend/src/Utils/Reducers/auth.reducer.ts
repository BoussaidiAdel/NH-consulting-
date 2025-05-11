import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../Actions/auth.actions';
import { AuthState } from '../app.state';

export const initialAuthState: AuthState = {
  isLoggedIn: true,
  user: null,
  role: 'ADMIN',
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, (state, { user, role }) => ({
    ...state,
    isLoggedIn: true,
    user,
    role,
  })),
  on(logout, () => initialAuthState)
);
