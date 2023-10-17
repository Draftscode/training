import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'state-management',
}, {
    path: 'state-management',
    loadChildren: () => import('./state-management/routes'),
},  {
    path: 'testing',
    loadChildren: () => import('./testing/routes'),
}, {
    path: '**',
    redirectTo: '',
}];
