import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction(
  '[Language] Set Language',
  props<{ language: string }>()
);

export const languageChangeSuccess = createAction(
  '[Language] Language Change Success',
  props<{ newLanguage: string }>()
);