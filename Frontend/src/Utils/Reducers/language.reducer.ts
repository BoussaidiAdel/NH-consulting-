import { createReducer, on } from '@ngrx/store';
import { setLanguage } from '../Actions/language.actions';

export const initialLanguageState = 'fr';

export const languageReducer = createReducer(
  initialLanguageState,
  on(setLanguage, (_, { language }) => language)
);
