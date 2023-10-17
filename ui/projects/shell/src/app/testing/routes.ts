import { importProvidersFrom } from "@angular/core";
import { Routes } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { UserState } from "./todo/data-access/user.state";

export default [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
}, {
    path: 'users',
    providers: [
        importProvidersFrom(
            NgxsModule.forFeature([UserState]),
        )
    ],
    loadComponent: () => import('./todo/features/list/users-list.component'),
}, {
    path: '**',
    redirectTo: '',
}] as Routes;