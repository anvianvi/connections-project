import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor( private http: HttpClient) {}

  logout(): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${API_URL}/logout`, {
      observe: 'response',
    });
  }
}
