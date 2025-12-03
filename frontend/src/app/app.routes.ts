import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { MedicamentosListPageComponent } from './features/medicamentos/pages/medicamentos-list-page/medicamentos-list-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'medicamentos',
    component: MedicamentosListPageComponent
  },
  {
    path: '',
    redirectTo: '/medicamentos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/medicamentos'
  }
];

