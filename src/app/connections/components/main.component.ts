import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div class="test-hello">hallo it works u a loged in and on main page</div>
  `,
  styles: [
    `
      .test-hello {
        background: lightcoral;
      }
    `,
  ],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('u are on main');
    console.log(localStorage);
  }
}
