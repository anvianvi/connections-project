import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-group-dialog',
  template: `
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
    `,
  ],
})
export class GroupDialogPageComponent implements OnInit {
  groupId: string = 'someid';

  constructor() {}

  ngOnInit() {}
}
