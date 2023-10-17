import { Routes } from "@angular/router";

export default [{
    path: '',
    loadComponent: () => import('./features/list/list.component'),
}] as Routes;