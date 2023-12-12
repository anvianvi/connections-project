import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NewUser,
  RegistrationResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) {}

  registerUser(data: NewUser): Observable<HttpResponse<RegistrationResponse>> {
    return this.http.post<RegistrationResponse>(
      `${API_URL}/registration`,
      data,
      {
        observe: 'response',
      }
    );
  }
}
