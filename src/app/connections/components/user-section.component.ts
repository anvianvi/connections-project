import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupService } from '../services/group-api.service';
import {
  GetConversationsListResponse,
  GetGroupListResponse,
  GetUserListResponse,
  GroupItem,
  MyCompanionsItem,
} from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupModalComponent } from './create-groupe-modal.component';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/state.model';
import { selectGroups } from 'src/app/state/selectors/group.selectors';
import { updateGroupsList } from 'src/app/state/actions/group.actions';
import { UserApiService } from '../services/user-api.services';
import { updateUsersList } from 'src/app/state/actions/user.actions';
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
      <div *ngFor="let companion of myCompanions$ | async">
        <p>{{ companion.userName.S }}</p>
      </div>

      <!-- <div *ngIf="usersList$ | async; asusersList"> -->
      <!-- <app-group-card
          *ngFor="let user of usersList"
          [user]="user"
          [currentuser]="currentuser"
        ></app-group-card> -->
      <!-- </div> -->
    </div>
  `,
  styles: [
    `
      ::ng-deep app-user-section {
      }

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
export class UserSectionComponent implements OnInit, OnDestroy {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  currentuser!: string;
  myCompanions$!: Observable<MyCompanionsItem[]>;

  constructor(
    private store: Store<AppState>,
    private userApiServices: UserApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.myCompanions$ = this.store.pipe(select(selectMyCompanions));
  }

  ngOnInit() {
    this.startCountdown('userList');
    // this.fetchGroupList();
    this.currentuser = localStorage.getItem('uid') || '1';
    // this.groupsList$ = this.store.pipe(select(selectGroups));
  }

  ngOnDestroy(): void {}

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

  createNewGrope() {
    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '500px',
      height: '150px',
    });
  }
}
