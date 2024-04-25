import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomRouteReuseStrategy } from './interfaces/customRouteReuseStrategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideClientHydration(),
    provideToastr(),
    provideAnimations(),
    importProvidersFrom([NgxSpinnerModule.forRoot({ type: 'timer' }), ModalModule.forRoot()]),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
