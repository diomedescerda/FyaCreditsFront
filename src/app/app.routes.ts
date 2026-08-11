import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/credits/credit-dashboard.component').then(
        ({ CreditDashboardComponent }) => CreditDashboardComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
