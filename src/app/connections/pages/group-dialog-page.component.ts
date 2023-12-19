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
        background: coral;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        height: 100%;
        padding-top: 20px;
      }
      .group-dialog-header {
        a {
          color: black;
          text-decoration: none;
        }
      }
    `,
  ],
})
export class GroupDialogPageComponent implements OnInit {
  private detailedSub = new Subject<void>();
  messages: MessageItem[] | undefined;

  groupId!: string;

  constructor(
    private location: Location,
    private groupAliService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.listenToRouteParams();
    this.fetchGroupMessages();
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
}
