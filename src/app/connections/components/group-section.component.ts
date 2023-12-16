import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-section',
  template: `
    <div class="group">
      My test group
      <div>
        <button (click)="updateList('groupList')" [disabled]="isButtonDisabled">
          Update Countdown 1
        </button>
        <span *ngIf="counter > 0">
          {{ counter }} seconds until next update
        </span>
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
    `,
  ],
})
export class GroupSectionComponent implements OnInit, OnDestroy {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;

  constructor() {}

  ngOnInit() {
    this.startCountdown('groupList');
  }

  ngOnDestroy(): void {}

  updateList(identifier: string): void {
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
