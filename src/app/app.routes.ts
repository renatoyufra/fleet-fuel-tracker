import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'vehicle/:plate',
    loadComponent: () => import('./pages/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent)
  }
];
