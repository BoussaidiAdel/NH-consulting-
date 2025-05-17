import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../Actions/auth.actions';
import { AuthState } from '../app.state';

export const initialAuthState: AuthState = {
  userId: 'null',
  role: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, (state, { userId, role }) => ({
    ...state,
    userId,
    role,
  })),
  on(logout, () => initialAuthState)
);
