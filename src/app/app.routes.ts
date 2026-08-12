import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(({ LoginComponent }) => LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then(({ RegisterComponent }) => RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password.component').then(
        ({ ForgotPasswordComponent }) => ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password.component').then(
        ({ ResetPasswordComponent }) => ResetPasswordComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/credits/credit-dashboard.component').then(
        ({ CreditDashboardComponent }) => CreditDashboardComponent,
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
