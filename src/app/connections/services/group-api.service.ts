import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  GetGroupListResponse,
  GetGroupMessagesResponse,
  PostGropeResponse,
  ServerResponse,
} from 'src/app/shared/interfaces/interfaces';
import { API_URL } from 'src/app/shared/variables/api';
import { addNewConversation } from 'src/app/state/actions/user.actions';
import { AppState } from 'src/app/state/state.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

  getGroupList(): Observable<HttpResponse<GetGroupListResponse>> {
    return this.http.get<GetGroupListResponse>(`${API_URL}/groups/list`, {
      observe: 'response',
    });
  }

  createNewGroupe(name: string): Observable<HttpResponse<PostGropeResponse>> {
    return this.http.post<PostGropeResponse>(
      `${API_URL}/groups/create`,
      { name: name },
      {
        observe: 'response',
      }
    );
  }

  deleteGroup(groupId: string): Observable<HttpResponse<ServerResponse>> {
    return this.http.delete<HttpResponse<ServerResponse>>(
      `${API_URL}/groups/delete?groupID=${groupId}`,
      {
        observe: 'response',
      }
    );
  }

  getGroupMessagesRequest(
    groupID: string,
    since?: number
  ): Observable<HttpResponse<GetGroupMessagesResponse>> {
    return this.http.get<GetGroupMessagesResponse>(
      `${API_URL}/groups/read?groupID=${groupID}&since=${since || ''}`,
      {
        observe: 'response',
      }
    );
  }

  handlegetGroupMessagesRequestSuccess(
    response: HttpResponse<GetGroupMessagesResponse>
  ): void {
    if (response.status === 200 && response.body) {
      this.snackBar.open('Conversation sucsesfuly created', 'OK', {
        duration: 5000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      console.log(response);
      // const newConversation = {
      //   id: { S: response.body.conversationID },
      //   companionID: { S: conmpanionID },
      // };
      // this.store.dispatch(
      //   addNewConversation({ conversation: newConversation })
      // );
    }
  }
}
