import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([400].includes(error.status)) {
        if (error.error.errors) {
          const modelStateErrors = [];
          for (const key in error.error.errors) {
            if (error.error.errors[key]) {
              modelStateErrors.push(error.error.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        } else {
          toastr.error(error.error, error.status.toString());
        }
      } else if ([401].includes(error.status)) {
        toastr.error('Unauthorized', error.status.toString());
      } else if ([404].includes(error.status)) {
        router.navigateByUrl('/not-found');
      } else if ([500].includes(error.status)) {
        const navigationExtras: NavigationExtras = { state: { error: error.error } }
        router.navigateByUrl('/server-error', navigationExtras);
      } else {
        toastr.error('Something unexpected went wrong');
        console.log(error);
      }
      return throwError(() => error);
    })
  );
};