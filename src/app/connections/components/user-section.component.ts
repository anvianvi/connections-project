import { Component, OnInit } from '@angular/core';
import {
  GetConversationsListResponse,
  GetUserListResponse,
  MyCompanionsItem,
} from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/state.model';
import { UserApiService } from '../services/user-api.services';
import { selectMyCompanions } from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-user-section',
  template: `
    <div>
      <div class="user-list-header">
        <h3>List of users</h3>
        <button
          mat-icon-button
          (click)="updateList('userList')"
          [disabled]="isButtonDisabled"
        >
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
      <div class="counter-container">
        <span *ngIf="counter > 0">
          {{ counter }} seconds until next update
        </span>
      </div>
      <div>
        <app-conversation-card
          *ngFor="let companion of myCompanions$ | async"
          [conversation]="companion"
        ></app-conversation-card>
      </div>
    </div>
  `,
  styles: [
    `
      .counter-container {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .user-list-header {
        display: flex;
        align-items: center;
        gap: 10px;
        h3 {
          margin: 0;
          font-weight: 500;
          font-size: 22px;
        }
      }
    `,
  ],
})
export class UserSectionComponent implements OnInit {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  myCompanions$!: Observable<MyCompanionsItem[]>;

  constructor(
    private store: Store<AppState>,
    private userApiServices: UserApiService,
    public dialog: MatDialog
  ) {
    this.myCompanions$ = this.store.pipe(select(selectMyCompanions));
  }

  ngOnInit() {
    this.startCountdown('userList');
    this.myCompanions$.pipe().subscribe((companions) => {
      console.log(companions);
      if (companions.length === 0) {
        this.fetchUserList();
        this.fetchConversationsList();
      }
    });
  }

  updateList(identifier: string): void {
    this.fetchUserList();
    this.fetchConversationsList();
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

  fetchUserList() {
    this.userApiServices.getUsersList().subscribe(
      (response: HttpResponse<GetUserListResponse>) => {
        this.userApiServices.handleGetUsersSuccess(response);
      },
      (error) => {
        this.userApiServices.handleResponseError(error);
        this.isButtonDisabled = false;
      }
    );
  }

  fetchConversationsList() {
    this.userApiServices.getConversationsList().subscribe(
      (response: HttpResponse<GetConversationsListResponse>) => {
        this.userApiServices.handleGetonversationsSuccess(response);
      },
      (error) => {
        this.userApiServices.handleResponseError(error);
        this.isButtonDisabled = false;
      }
    );
  }
}
