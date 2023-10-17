import { importProvidersFrom } from "@angular/core";
import { Routes } from "@angular/router";
import { StoreModule } from '@ngrx/store';
import { NgxsModule } from '@ngxs/store';
import { TodoState as CustomTodoState } from './custom/data-access/todo.state';
import { todoReducer } from "./ngrx/data-access/todo.reducer";
import { TodoState } from "./ngxs/data-access/todo.state";
import { TodoState as RxAngularTodoState } from './rx-angular/data-access/state';
import { UserState } from "./use-case/data-access/user.state";
import { PreferencesState } from "./use-case/data-access/preferences.state";

export default [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'ngxs',
}, {
    path: 'custom',
    providers: [CustomTodoState],
    loadComponent: () => import('./custom/custom.component'),
}, {
    path: 'ngxs',
    providers: [
        importProvidersFrom(
            NgxsModule.forFeature([TodoState])
        )
    ],
    loadComponent: () => import('./ngxs/ngxs.component'),
}, {
    path: 'ngrx',
    providers: [
        importProvidersFrom(
            StoreModule.forFeature('todo', todoReducer),
        )
    ],
    loadComponent: () => import('./ngrx/ngrx.component'),
}, {
    path: 'rx-angular',
    providers: [
        RxAngularTodoState
    ],
    loadComponent: () => import('./rx-angular/rx-angular.component'),
}, {
    path: 'use-case',
    providers: [
        importProvidersFrom(
            NgxsModule.forFeature([UserState, PreferencesState])
        )
    ],
    loadChildren: () => import('./use-case/use-case.routes'),
}, {
    path: '**',
    redirectTo: '',
}] as Routes;