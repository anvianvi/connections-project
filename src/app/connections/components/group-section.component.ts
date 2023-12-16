import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-section',
  template: ` <div class="group">my test group</div> `,
  styles: [
    `
      ::ng-deep app-group-section {
      }

      .group {
        background: pink;
        width: 200px;
        height: 200px;
      }
    `,
  ],
})
export class GroupSectionComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('grupsection works');
  }
}
