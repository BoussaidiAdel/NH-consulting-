import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { routes } from './app.routes';
import { translateModuleProvider } from '../Utils/translation.provider';
import { provideStore, StoreModule } from '@ngrx/store';
import { languageReducer } from '../Utils/Reducers/language.reducer';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { LanguageEffects } from '../Utils/Effects/language.effects';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent } from '../Pages/contact-page/contact.component';
import { MapComponent } from '../components/map/map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { authReducer } from '../Utils/Reducers/auth.reducer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormationsComponent } from '../Pages/formation-page/formations.component';
import { HomepageComponent } from '../Pages/homepage/homepage.component';
import { SlideContainerComponent } from '../components/slide-container/slide-container.component';
import { UserManagementComponent } from '../Pages/user-management/user-management.component';
import { AuthInterceptor } from '../Utils/auth.interceptor';
import { ErrorPageComponent } from '../Pages/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ContactComponent,
    MapComponent,
    FormationsComponent,
    HomepageComponent,
    SlideContainerComponent,
    UserManagementComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(routes),
    translateModuleProvider,
    // Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatExpansionModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      selectedLanguage: languageReducer,
      auth: authReducer
    }),
    EffectsModule.forRoot([LanguageEffects]),
    translateModuleProvider
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // 
    },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
