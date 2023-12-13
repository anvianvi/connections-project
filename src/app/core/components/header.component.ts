import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  template: `<header class="header-content-wrapper">
    <div class="logo-container">
      <a routerLink="/" aria-label="Logo">
        <img class="logo" src="assets/logo.png" alt="site logo" />
      </a>
    </div>

    <app-login-status-bar
      *ngIf="authService.isAuthenticated() | async"
    ></app-login-status-bar>
  </header> `,
  styles: [
    `
      ::ng-deep app-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #e5e5e5;
      }

      .header-content-wrapper {
        width: min(98vw, 1200px);
        margin-inline: auto;
        height: 80px;
        padding-inline: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo-container {
        width: 50px;
      }

      .logo {
        width: 50px;
      }

      .main-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
