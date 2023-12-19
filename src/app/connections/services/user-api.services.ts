import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {
  CreateConversationResponse,
  GetConversationsListResponse,
  GetUserListResponse,
  ServerResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getUsersList(): Observable<HttpResponse<GetUserListResponse>> {
    return this.http.get<GetUserListResponse>(`${API_URL}/users`, {
      observe: 'response',
    });
  }

  getConversationsList(): Observable<
    HttpResponse<GetConversationsListResponse>
  > {
    return this.http.get<GetConversationsListResponse>(
      `${API_URL}/conversations/list`,
      {
        observe: 'response',
      }
    );
  }

  createConversation(
    companionID: string
  ): Observable<HttpResponse<CreateConversationResponse>> {
    return this.http.post<CreateConversationResponse>(
      `${API_URL}/groups/create`,
      { companionID: companionID },
      {
        observe: 'response',
      }
    );
  }

  deleteGroup(groupId: string): Observable<HttpResponse<ServerResponse>> {
    return this.http.delete<HttpResponse<ServerResponse>>(
      `${API_URL}/groups/delete?groupID=${groupId}`
    );
  }

  handleResponseError(error: { error: { message: string } }): void {
    this.snackBar.open(
      `Oops, something went wrong: ${error.error.message}`,
      'OK',
      {
        duration: 5000,
        panelClass: ['mat-error'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }
}
