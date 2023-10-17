import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { StoreModule, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { TodoState } from './state-management/ngxs/data-access/todo.state';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxsModule.forRoot([TodoState], {
        developmentMode: true,
        selectorOptions: {
          suppressErrors: false,
          injectContainerState: false
        }
      }),
      StoreModule.forRoot(),
      // NgxsReduxDevtoolsPluginModule.forRoot({
      //   name: 'ngxs store'
      // }),
    ),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideStore({}),
    provideStoreDevtools(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
