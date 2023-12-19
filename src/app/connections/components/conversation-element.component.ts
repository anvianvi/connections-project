import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CreateConversationResponse,
  MyCompanionsItem,
} from 'src/app/shared/interfaces/interfaces';
import { UserApiService } from '../services/user-api.services';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-conversation-card',
  template: `<div
    class="conversation-card-container"
    [ngStyle]="{ background: !isExistingConversation ? '#FEFCF3' : '#F0DBDB' }"
  >
    <div
      class="conversation-name"
      (click)="openConversation(conversation.companionID.S)"
    >
      {{ conversation.userName.S }}
    </div>
  </div> `,
  styles: [
    `
      .conversation-card-container {
        display: flex;
        justify-content: space-between;
        max-width: 360px;
        align-items: center;
        border-radius: 5px;
        border: 1px solid rgb(227 175 175);
        margin-bottom: 5px;

        .conversation-name {
          display: flex;
          align-items: center;
          min-width: 300px;
          height: 50px;
          padding-left: 5px;
        }
        .conversation-name:hover {
          cursor: pointer;
          text-decoration: underline;
          font-weight: 500;
        }
      }
    `,
  ],
})
export class ConversationCardComponent {
  isExistingConversation = false;

  constructor(
    private userApiServices: UserApiService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  @Input() conversation!: MyCompanionsItem;

  ngOnInit() {
    if (this.conversation.conversationId?.S != null) {
      this.isExistingConversation = true;
    }
  }

  openConversation(companionID: string) {
    if (this.isExistingConversation === false) {
      this.userApiServices.createConversation(companionID).subscribe(
        (response: HttpResponse<CreateConversationResponse>) => {
          this.userApiServices.handleCreateConversationSuccess(
            companionID,
            response
          );
          this.router.navigate(['/conversation', companionID]);
        },
        (error) => {
          this.userApiServices.handleResponseError(error);
        }
      );
    } else {
      console.log('here shoud be method to open existing conversation');
      this.router.navigate(['/conversation', companionID]);
    }
  }
}
