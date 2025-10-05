import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import addUserId from './Core/Interceptor/add-userId';
import logBodyInterceptor from './Core/Interceptor/log-body.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import sessionInterceptor from './Core/Interceptor/Session.interceptor';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(
      withInterceptors([addUserId, sessionInterceptor, logBodyInterceptor])
    ),
    
  ],
};
