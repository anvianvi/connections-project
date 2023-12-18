import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupService } from '../services/group-serices.service';
import {
  GetGroupListResponse,
  GroupItem,
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

@Component({
  selector: 'app-group-section',
  template: `
    <div class="group">
      <div class="goup-list-header">
        <h3>List of groups</h3>
        <button mat-icon-button (click)="createNewGrope()">
          <mat-icon>add</mat-icon>
        </button>
        <button
          mat-icon-button
          (click)="updateList('groupList')"
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
      <div *ngIf="groupsList$ | async as groupsList">
        <app-group-card
          *ngFor="let group of groupsList"
          [group]="group"
          [currentuser]="currentuser"
        ></app-group-card>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-group-section {
      }

      .group {
        background: pink;
        min-width: 200px;
        min-height: 200px;
      }
      .counter-container {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .goup-list-header {
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
export class GroupSectionComponent implements OnInit, OnDestroy {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  currentuser!: string;
  groupsList$!: Observable<GroupItem[]>;

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.startCountdown('groupList');
    this.fetchGroupList();
    this.currentuser = localStorage.getItem('uid') || '1';
    this.groupsList$ = this.store.pipe(select(selectGroups));
  }

  ngOnDestroy(): void {}

  updateList(identifier: string): void {
    this.fetchGroupList();
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

  fetchGroupList() {
    this.groupService.getGroupList().subscribe(
      (response: HttpResponse<GetGroupListResponse>) =>
        this.handleGroupListSuccess(response),
      (error) => this.handleGroupListError(error)
    );
  }

  private handleGroupListSuccess(
    response: HttpResponse<GetGroupListResponse>
  ): void {
    if (response.status === 200 && response.body) {
      this.snackBar.open('GroupListReceived', 'OK', {
        duration: 10000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      this.store.dispatch(updateGroupsList({ groups: response.body.Items }));
    }
  }

  private handleGroupListError(error: { error: { message: string } }): void {
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
    this.isButtonDisabled = false;
  }

  createNewGrope() {
    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '500px',
      height: '150px',
    });
  }
}
