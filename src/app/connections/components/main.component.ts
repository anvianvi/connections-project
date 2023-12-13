import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div class="test-hello">
      <p>hallo it works u a loged in and on main page</p>
      <p>here shoud be main content</p>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        background: lightcoral;
      }

      .test-hello {
        font-size: 3em;
        color: antiquewhite;
        height: 30vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
