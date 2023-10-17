import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  template: `
  <div class="flex w-full h-full">
    <p-panelMenu [multiple]="true" [model]="items" [style]="{'width':'250px'}"></p-panelMenu>
    <div class="flex w-full h-full surface-ground">
      <router-outlet></router-outlet>
    </div>
  </div>
  `
})
export class AppComponent {
  protected items: MenuItem[] = [{
    label: 'Statemanagement',
    expanded: true,
    items: [{
      label: 'custom',
      // routerLinkActiveOptions: { eaxt: true },
      routerLink: ['state-management/custom'],
      styleClass: 'tim-menu-item',
      routerLinkActiveOptions: { exact: true }
    }, {
      label: '@ngxs/store',
      routerLink: ['state-management/ngxs'],
    }, {
      label: '@ngrx/store',
      routerLink: ['state-management/ngrx'],
    }, {
      label: '@rx-angular',
      routerLink: ['state-management/rx-angular'],
    }, {
      label: 'use-case',
      routerLink: ['state-management/use-case'],
    }],
  }, {
    label: 'Testing',
    expanded: true,
    items: [{
      label: 'users',
      routerLink: ['testing/users'],
      styleClass: 'tim-menu-item',
      routerLinkActiveOptions: { exact: true }
    },],
  }];
}
