import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation-page',
  template: `
    <div>
      conversationpageworck
      <p>{{ conversation }}</p>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-conversation-page {
        background: lightblue;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        height: 100%;
        padding-top: 20px;
      }
    `,
  ],
})
export class ConversationPageComponent implements OnInit {
  conversation: string = 'someidconversation';

  constructor() {}

  ngOnInit() {}
}
