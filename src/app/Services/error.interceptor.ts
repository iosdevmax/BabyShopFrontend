import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api, it means that the access token is expired
        // try to autologin again
        // this.auth.autoLogin();

        // location.reload(true);
        this.auth.logout();
      }

      const error = err.error.message || err.statusText;
      return throwError(error);

    }));
  }


}
