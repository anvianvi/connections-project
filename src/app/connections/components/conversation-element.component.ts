import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MyCompanionsItem } from 'src/app/shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-card',
  template: `<div
    class="conversation-card-container"
    [ngStyle]="{ background: isExistingConversation ? '#FEFCF3' : '#F0DBDB' }"
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

  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    if (this.conversation.conversationId?.S != null) {
      this.isExistingConversation = true;
    }
  }

  @Input() conversation!: MyCompanionsItem;

  openConversation(companionID: string) {
    
    this.router.navigate(['/conversation', companionID]);
  }
}
