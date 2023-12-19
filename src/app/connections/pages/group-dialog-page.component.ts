import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-group-dialog',
  template: `
    <div class="group-dialog-header">
      <a href="#" (click)="goBack($event)"> <mat-icon>arrow_back</mat-icon> </a>
    </div>
    <div>
      group dialog page worck
      <p>{{ groupId }}</p>
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
  groupId: string = 'someid';

  constructor(private location: Location) {}

  ngOnInit() {}

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }
}
