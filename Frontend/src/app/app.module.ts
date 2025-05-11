import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { routes } from './app.routes';
import {translateModuleProvider } from '../Utils/translation.provider';
import { provideStore } from '@ngrx/store';
import { languageReducer } from '../Utils/Reducers/language.reducer';
import { provideEffects } from '@ngrx/effects';
import { LanguageEffects } from '../Utils//Effects/language.effects';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent } from '../Pages/contact-page/contact.component';
import { MapComponent } from '../components/map/map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { authReducer } from '../Utils/Reducers/auth.reducer';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ContactComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    translateModuleProvider,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  providers: [
    provideStore({language : languageReducer}),
    provideStore({auth : authReducer}),
    provideEffects(LanguageEffects)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
