import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  
  providers: [

    provideRouter(routes),

    provideZoneChangeDetection({ eventCoalescing: true }), 
   
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

    provideAnimationsAsync(),

  ]
  
};
