import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <a href="https://www.linkedin.com/in/pavel-viarbitsky/" target="_blank"
        >Pavel Viarbitsky</a
      >&nbsp;<a href="https://rs.school/" target="_blank">rs.school</a>
      2023
    </footer>
  `,
  styles: [
    `
      ::ng-deep app-footer {
        display: flex;
        justify-content: center;
        padding: 20px;

        a {
          text-decoration: none;
          color: #333333;
        }
      }
    `,
  ],
})
export class FooterComponent {}
