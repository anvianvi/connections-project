import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CreateConversationResponse,
  GetConversationsListResponse,
  GetUserListResponse,
  ServerResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';
import {
  addNewConversation,
  updateConversationsList,
  updateUsersList,
} from 'src/app/state/actions/user.actions';
import { AppState } from 'src/app/state/state.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

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
      `${API_URL}/conversations/create`,
      { companion: companionID },
      {
        observe: 'response',
      }
    );
  }

  handleCreateConversationSuccess(
    conmpanionID: string,
    response: HttpResponse<CreateConversationResponse>
  ): void {
    if (response.status === 201 && response.body) {
      this.snackBar.open('Conversation sucsesfuly created', 'OK', {
        duration: 5000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      const newConversation = {
        id: { S: response.body.conversationID },
        companionID: { S: conmpanionID },
      };
      this.store.dispatch(
        addNewConversation({ conversation: newConversation })
      );
    }
  }

  handleGetUsersSuccess(response: HttpResponse<GetUserListResponse>): void {
    if (response.status === 200 && response.body) {
      this.snackBar.open('Users List Received', 'OK', {
        duration: 5000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      this.store.dispatch(updateUsersList({ users: response.body.Items }));
    }
  }

  handleGetonversationsSuccess(
    response: HttpResponse<GetConversationsListResponse>
  ): void {
    if (response.status === 200 && response.body) {
      this.snackBar.open('Conversations List Received', 'OK', {
        duration: 5000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      this.store.dispatch(
        updateConversationsList({ conversations: response.body.Items })
      );
    }
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
