import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

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
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.open(
            `'HTTP error occurred:' ${error.error.message}`,
            'OK',
            {
              duration: 5000,
              panelClass: ['mat-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          return throwError(error);
        })
      );
    } else {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.open(
            `'HTTP error occurred:' ${error.error.message}`,
            'OK',
            {
              duration: 5000,
              panelClass: ['mat-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          return throwError(error);
        })
      );
    }
  }
}
