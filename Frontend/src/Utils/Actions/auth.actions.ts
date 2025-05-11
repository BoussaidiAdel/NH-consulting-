import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ user: any; role: string }>());
export const logout = createAction('[Auth] Logout');
