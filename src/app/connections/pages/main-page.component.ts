import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div class="main-column"><app-group-section></app-group-section></div>
    <div class="main-column"><app-user-section></app-user-section></div>
  `,
  styles: [
    `
      ::ng-deep app-main {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
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
