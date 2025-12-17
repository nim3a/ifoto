import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'landing-old',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'upload',
    loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'health',
    loadComponent: () => import('./pages/health/health.component').then(m => m.HealthComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery-list/gallery-list.component').then(m => m.GalleryListComponent)
  },
  {
    path: 'gallery/:id',
    loadComponent: () => import('./pages/gallery-detail/gallery-detail.component').then(m => m.GalleryDetailComponent)
  },
  {
    path: 'find-photo',
    loadComponent: () => import('./pages/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'find-photo/:id',
    loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
