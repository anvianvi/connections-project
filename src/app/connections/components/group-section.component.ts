import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupService } from '../services/group-serices.service';
import { GetGroupListResponse } from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-section',
  template: `
    <div class="group">
      <div>
        <button (click)="updateList('groupList')" [disabled]="isButtonDisabled">
          Update
        </button>
        <span *ngIf="counter > 0">
          {{ counter }} seconds until next update
        </span>
        <button>create(tbd)</button>
      </div>
      <h3>List of groups</h3>
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
    `,
  ],
})
export class GroupSectionComponent implements OnInit, OnDestroy {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  data!: GetGroupListResponse | null;

  constructor(
    private groupService: GroupService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.startCountdown('groupList');
    this.fetchGroupList();
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
      (response: HttpResponse<GetGroupListResponse>) => {
        console.log(response);
        if (response.status === 200) {
          this.snackBar.open('GroupListResived', 'OK', {
            duration: 10000,
            panelClass: ['mat-accent'],
            horizontalPosition: 'right',
          });
          this.data = response.body;
        }
      },
      (error) => {
        this.snackBar.open(`Uups smth go wrong ${error.message}`, 'OK', {
          duration: 5000,
          panelClass: ['mat-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.isButtonDisabled = false;
      }
    );
  }
}
