import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setLanguage } from '../../Utils/Actions/language.actions';
import { selectSelectedLanguage } from '../../Utils/Selectors/language.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone : false
})
export class HeaderComponent {
  selectedLanguage$: Observable<string>;

  constructor(private store: Store) {
    this.selectedLanguage$ = this.store.select(selectSelectedLanguage);
  }

  changeLanguage(lang: string): void {
    this.store.dispatch(setLanguage({ language: lang }));
  }
}
