import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

export function tokenGetter() {
  const platformId = inject(PLATFORM_ID);

  // Evita usar sessionStorage en el servidor
  if (!isPlatformBrowser(platformId)) {
    return null;
  }

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
