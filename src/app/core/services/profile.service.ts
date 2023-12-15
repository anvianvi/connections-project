import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  GetProfileResponse,
  ServerResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  fetchInfo(): Observable<GetProfileResponse> {
    return this.http.get<GetProfileResponse>(`${API_URL}/profile`).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  putUserName(name: string): Observable<HttpResponse<ServerResponse>> {
    return this.http.put<ServerResponse>(
      `${API_URL}/profile`,
      { name },
      {
        observe: 'response',
      }
    );
  }

  fetchProfileInfo() {
    this.fetchInfo().subscribe(
      (response: GetProfileResponse) => {
        if (response) {
          localStorage.setItem('name', response.name.S);
          localStorage.setItem('createdAt', response.createdAt.S);

          this.snackBar.open('LogIn successful!', 'OK', {
            duration: 2000,
            panelClass: ['mat-accent'],
            horizontalPosition: 'right',
          });
        } else {
          this.snackBar.open('Oops, something went wrong!', 'OK', {
            duration: 5000,
            panelClass: ['mat-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  private handleError(error: any): void {
    let errorMessage = 'An error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    this.snackBar.open(errorMessage, 'OK', {
      duration: 5000,
      panelClass: ['mat-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
