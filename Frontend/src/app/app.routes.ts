import { Routes } from '@angular/router';
import { ContactComponent } from '../Pages/contact-page/contact.component';
import { HomepageComponent } from '../Pages/homepage/homepage.component';
import { FormationsComponent } from '../Pages/formation-page/formations.component';

export const routes: Routes = [
    { path:'contact' , component : ContactComponent},
    { path: '' , component : HomepageComponent},
    {path : 'formation' , component : FormationsComponent}
];
