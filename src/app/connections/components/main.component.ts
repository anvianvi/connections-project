import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div class="main-column"><app-group-section></app-group-section></div>
    <div class="main-column"></div>
  `,
  styles: [
    `
      ::ng-deep app-main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: flex-wrap;
        height: 100%;
        padding-top: 20px;
      }

      .main-column {
        min-width: 360px;
        height: 100%;
      }
    `,
  ],
})
export class MainPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
