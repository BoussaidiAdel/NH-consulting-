import { Routes } from '@angular/router';
import { ContactComponent } from '../Pages/contact-page/contact.component';
import { HomepageComponent } from '../Pages/homepage/homepage.component';
import { FormationsComponent } from '../Pages/formation-page/formations.component';
import { ErrorPageComponent } from '../Pages/error-page/error-page.component';
import { UserManagementComponent } from '../Pages/user-management/user-management.component';
import { SignInComponent } from '../Pages/signin-page/signin.component';

export const routes: Routes = [
    { path: 'Home' , component : HomepageComponent},
    { path:'contact' , component : ContactComponent},
    {path : 'formation' , component : FormationsComponent},
    {path:'user-manage/:id' , component:UserManagementComponent},
    {path:'signin' , component:SignInComponent},
    { path: '**', component: ErrorPageComponent }
];
