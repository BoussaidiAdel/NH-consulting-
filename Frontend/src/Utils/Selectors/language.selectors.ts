import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectLanguageState = createFeatureSelector<AppState>('language');

export const selectSelectedLanguage = createSelector(
  selectLanguageState,
  (state: AppState) => state?.selectedLanguage || 'en'
);
