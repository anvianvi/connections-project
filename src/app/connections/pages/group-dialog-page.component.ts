import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GroupService } from '../services/group-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  GetGroupMessagesResponse,
  MessageItem,
} from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';

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
    </div>

    <div class="counter-container">
      <span *ngIf="counter > 0"> {{ counter }} seconds until next update </span>
    </div>
    <div>
      group dialog page worck
      <p>{{ groupId }}</p>
      <div *ngFor="let message of messages">
        {{ message.createdAt.S }} - {{ message.message.S }} -
        {{ message.authorID.S }}
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
    `,
  ],
})
export class GroupDialogPageComponent implements OnInit {
  counter: number = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  isButtonDisabled = false;
  private detailedSub = new Subject<void>();
  groupId!: string;

  messages: MessageItem[] | undefined;

  constructor(
    private location: Location,
    private groupAliService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.listenToRouteParams();
    this.fetchGroupMessages();
    this.startCountdown('group_chat_' + this.groupId);
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
    this.groupAliService.getGroupMessagesRequest(this.groupId).subscribe(
      (response: HttpResponse<GetGroupMessagesResponse>) => {
        console.log('cool we got correct response');
        console.log(response);
        this.messages = response.body?.Items;
      },
      (error) => {
        if (error.error.type === 'InvalidIDException') {
          this.router.navigate(['404']);

          console.log('you are doing well');
        }
      }
    );
  }

  updateList(identifier: string): void {
    this.fetchGroupMessages();
    this.isButtonDisabled = true;
    localStorage.setItem(
      `lastClickTimestamp_${identifier}`,
      Date.now().toString()
    );
    this.startCountdown(identifier);
    console.log(identifier);
  }

  startCountdown(identifier: string): void {
    console.log(identifier);

    this.isButtonDisabled = true;
    let secondsRemaining = Math.floor(
      (Date.now() -
        Number(localStorage.getItem(`lastClickTimestamp_${identifier}`))) /
        1000
    );
    console.log();
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
