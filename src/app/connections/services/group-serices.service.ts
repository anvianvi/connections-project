import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetGroupListResponse,
  PostGropeResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getGroupList(): Observable<HttpResponse<GetGroupListResponse>> {
    return this.http.get<GetGroupListResponse>(`${API_URL}/groups/list`, {
      observe: 'response',
    });
  }

  createNewGroupe(name: string): Observable<HttpResponse<PostGropeResponse>> {
    console.log(name);
    return this.http.post<PostGropeResponse>(
      `${API_URL}/groups/create`,
      { name: name },
      {
        observe: 'response',
      }
    );
  }
}
