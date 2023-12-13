import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const email = localStorage.getItem('email');

    if (token && uid && email) {
      request = request.clone({
        setHeaders: {
          'rs-uid': uid,
          'rs-email': email,
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(request);
    } else {
      return next.handle(request);
    }
  }
}
