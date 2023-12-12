import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NewUser,
  RegistrationResponse,
} from 'src/app/shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'https://tasks.app.rs.school/angular/registration';

  constructor(private http: HttpClient) {}

  registerUser(data: NewUser): Observable<HttpResponse<RegistrationResponse>> {
    return this.http.post<RegistrationResponse>(this.apiUrl, data, {
      observe: 'response',
    });
  }
}
