import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GroupService } from '../services/group-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  GetGroupMessagesResponse,
  GroupItem,
  MessageItem,
  UserItem,
} from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confiration-dialog.component';

import { DateService } from 'src/app/core/services/data.service';
import { AppState } from 'src/app/state/state.model';
import { Store, select } from '@ngrx/store';
import { selectUserById } from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-group-dialog',
  template: `
    <div class="group-dialog-header">
      <a href="#" (click)="goBack($event)"> <mat-icon>arrow_back</mat-icon> </a>
      <button
        mat-icon-button
        (click)="updateList('group_chat_' + groupId)"
        [disabled]="isButtonDisabled"
      >
        <mat-icon>refresh</mat-icon>
      </button>
      <button
        mat-icon-button
        *ngIf="isMygroupe"
        (click)="openConfirmationDialog(groupId)"
      >
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
      ::ng-deep app-group-dialog {
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
      }
    `,
  ],
})
export class GroupDialogPageComponent implements OnInit {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  private detailedSub = new Subject<void>();
  groupId!: string;
  isMygroupe = false;
  currenGroup: GroupItem | undefined;
  currentuser!: string;

  messages: MessageItem[] | undefined;

  constructor(
    private location: Location,
    private groupApiService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public dateService: DateService,
    private store: Store<AppState>
  ) {
    this.currentuser = localStorage.getItem('uid') || '1';
  }

  ngOnInit() {
    this.listenToRouteParams();
    this.fetchGroupMessages();
    this.startCountdown('group_chat_' + this.groupId);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.isMygroupe = params['mygroupe'];
    });
  }

  private listenToRouteParams() {
    this.activatedRoute.params
      .pipe(takeUntil(this.detailedSub))
      .subscribe((params) => {
        this.groupId = params['groupID'];
      });
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }

  fetchGroupMessages() {
    this.groupApiService.getGroupMessagesRequest(this.groupId).subscribe(
      (response: HttpResponse<GetGroupMessagesResponse>) => {
        console.log('cool we got correct response');
        console.log(response);
        this.messages = response.body?.Items;
        this.messages?.sort((a, b) => {
          const createdAtA = Number(b.createdAt.S);
          const createdAtB = Number(a.createdAt.S);
          return createdAtB - createdAtA;
        });
      },
      (error) => {
        if (error.error.type === 'InvalidIDException') {
          this.router.navigate(['404']);
        }
      }
    );
  }

  getUserNameByID(id: string): Observable<string> {
    return this.store.pipe(
      select(selectUserById(id)),
      map((user: UserItem | undefined) =>
        user && user.name ? user.name.S : 'User not exists in db'
      )
    );
  }

  openConfirmationDialog(groupeId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure you want to delete this group?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.groupApiService.handleDeleteSelectedGroup(groupeId);
        this.router.navigate(['/']);
      }
    });
  }

  updateList(identifier: string): void {
    this.fetchGroupMessages();
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
}
