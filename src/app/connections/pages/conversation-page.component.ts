import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { DateService } from 'src/app/core/services/data.service';
import { AppState } from 'src/app/state/state.model';
import { Location } from '@angular/common';
import { UserApiService } from '../services/user-api.services';
import {
  GetGroupMessagesResponse,
  MessageItem,
  UserItem,
} from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { selectUserById } from 'src/app/state/selectors/users.selectors';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confiration-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-conversation-page',
  template: `
    <div class="group-dialog-header">
      <a href="#" (click)="goBack($event)"> <mat-icon>arrow_back</mat-icon> </a>
      <button
        mat-icon-button
        (click)="updateList('chat_' + conversationId)"
        [disabled]="isButtonDisabled"
      >
        <mat-icon>refresh</mat-icon>
      </button>
      <button mat-icon-button (click)="openConfirmationDialog(conversationId)">
        <mat-icon>delete</mat-icon>
      </button>
    </div>

    <div class="counter-container">
      <span *ngIf="counter > 0"> {{ counter }} seconds until next update </span>
    </div>

    <div class="mesages-wraper" *ngFor="let message of messages">
      <div
        class="message-container"
        [ngStyle]="{
          'margin-left': currentuser === message.authorID.S ? 'auto' : '0'
        }"
      >
        <div class="message-date">
          {{ dateService.formatUnixTimestamp(message.createdAt.S) }}
        </div>
        <div class="mesage-author">
          {{ getUserNameByID(message.authorID.S) | async }}:
        </div>
        <div class="message-text">{{ message.message.S }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-conversation-page {
        padding-top: 20px;
      }
      .counter-container {
        height: 30px;
      }

      .group-dialog-header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-block: 20px;

        a {
          color: black;
          text-decoration: none;
        }
      }

      .message-container {
        background: #fefcf3;
        border: 2px solid #f0dbdb;
        padding: 5px;
        width: 350px;
        border-radius: 10px;
        margin-bottom: 5px;
      }
      .message-date {
        margin-bottom: 5px;
      }
      .mesage-author {
        font-weight: 500;
        font-size: 18px;
        margin-bottom: 5px;
      }
      .message-text {
        font-size: 16px;
        overflow-wrap: break-word;
      }
    `,
  ],
})
export class ConversationPageComponent implements OnInit {
  private detailedSub = new Subject<void>();
  conversationId!: string;
  messages: MessageItem[] | undefined;
  currentuser!: string;
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  dataOfLastFetch!: number;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public dateService: DateService,
    private store: Store<AppState>,
    private userApiServices: UserApiService,
    private snackBar: MatSnackBar
  ) {
    this.currentuser = localStorage.getItem('uid') || '1';
  }

  ngOnInit() {
    this.listenToRouteParams();
    this.fetchUsersMessages();
    this.startCountdown('chat_' + this.conversationId);
    this.dataOfLastFetch = Math.floor(Date.now());
  }

  openConfirmationDialog(groupeId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure you want to delete this conversation?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.userApiServices.handleDeleteSelectedConversation(groupeId);
        this.router.navigate(['/']);
      }
    });
  }

  private listenToRouteParams() {
    this.activatedRoute.params
      .pipe(takeUntil(this.detailedSub))
      .subscribe((params) => {
        this.conversationId = params['conversationID'];
      });
  }

  getUserNameByID(id: string): Observable<string> {
    return this.store.pipe(
      select(selectUserById(id)),
      map((user: UserItem | undefined) =>
        user && user.name ? user.name.S : 'User not exists in db'
      )
    );
  }

  fetchUsersMessages(since?: number) {
    this.userApiServices
      .getUserChatMessagesRequest(this.conversationId, since)
      .subscribe(
        (response: HttpResponse<GetGroupMessagesResponse>) => {
          console.log('cool we got correct response');
          console.log(response);
          if (response.body?.Items.length == 0) {
            console.log('there is no new messages sinse last fetch');
            this.snackBar.open(
              'There is no new messages sinse last fetch',
              'OK',
              {
                duration: 10000,
                panelClass: ['mat-accent'],
                horizontalPosition: 'right',
              }
            );
          }
          this.messages = response.body?.Items;
          this.messages?.sort((a, b) => {
            const createdAtA = Number(b.createdAt.S);
            const createdAtB = Number(a.createdAt.S);
            return createdAtB - createdAtA;
          });
        },
        (error) => {
          console.log(error);
          if (error.error.type === 'InvalidIDException') {
            this.router.navigate(['404']);
          }
        }
      );
  }

  updateList(identifier: string): void {
    this.fetchUsersMessages(this.dataOfLastFetch);
    this.isButtonDisabled = true;
    localStorage.setItem(
      `lastClickTimestamp_${identifier}`,
      Date.now().toString()
    );
    this.startCountdown(identifier);
  }

  startCountdown(identifier: string): void {
    this.isButtonDisabled = true;
    let secondsRemaining = Math.floor(
      (Date.now() -
        Number(localStorage.getItem(`lastClickTimestamp_${identifier}`))) /
        1000
    );
    this.counter = 60 - secondsRemaining;
    if (this.counter < 1) {
      this.isButtonDisabled = false;
    }
    this.timer = setInterval(() => {
      this.counter -= 1;

      if (this.counter < 1) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.counter = 0;
        this.isButtonDisabled = false;
      }
    }, 1000);
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }
}
