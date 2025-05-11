import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { setLanguage } from '../Actions/language.actions';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageEffects {
  private actions$ = inject(Actions);
  private translate = inject(TranslateService);

  afterLanguageSet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLanguage),
        tap(({ language }) => {
          console.log(`Switching to language: ${language}`);
          this.translate.use(language);
        })
      ),
    { dispatch: false }
  );
}