import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ userId: string; role: string }>()
);

export const logout = createAction('[Auth] Logout');