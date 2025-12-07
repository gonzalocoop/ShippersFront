import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return sessionStorage.getItem('token');
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['shipperapp.azurewebsites.net'],
          disallowedRoutes: ['https://shipperapp.azurewebsites.net/login/forget','https://shipperapp.azurewebsites.net/login','https://shipperapp.azurewebsites.net/lasfijas/fijasfuera','https://shipperapp.azurewebsites.net/registrarcuenta','https://shipperapp.azurewebsites.net/registrarcuenta/listarusuarios','https://shipperapp.azurewebsites.net/registrarcuenta/listarroles'],
        },
      })
    ), provideAnimationsAsync()
  ]
};
