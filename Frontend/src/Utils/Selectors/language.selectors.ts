import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';


export const selectLanguageState = createFeatureSelector<AppState>('selectedLanguage');

export const selectSelectedLanguage = createSelector(
  selectLanguageState,
  (state: AppState) => state.selectedLanguage
);
