import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div class="main-column"><app-group-section></app-group-section></div>
    <div class="main-column right"></div>
  `,
  styles: [
    `
      ::ng-deep app-main {
        display: flex;
        justify-content: center; 
        align-items: center;
        flex-wrap: flex-wrap;
        height: 100%;
        background: lightcoral;
        padding-top: 20px;
      }

      .main-column {
        background: lightblue;
        flex: 1;
        min-width: 360px;
        height: 100%;
      }
      .right {
        background: lightgreen;
      }
    `,
  ],
})
export class MainPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('u are on main');
    console.log(localStorage);
  }
}
