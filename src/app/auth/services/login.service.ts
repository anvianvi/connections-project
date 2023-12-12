import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationResponse } from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class LogInService {
  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<HttpResponse<RegistrationResponse>> {
    const body = { email, password };

    return this.http.post<RegistrationResponse>(`${API_URL}/login`, body, {
      observe: 'response',
    });
  }
}
