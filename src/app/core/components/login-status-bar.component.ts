import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/localStorage.service';

@Component({
  selector: 'app-login-status-bar',
  template: `
    <div class="login-info-container">
      <img
        src="assets/login.svg"
        alt="icon of logined account"
        [matMenuTriggerFor]="beforeMenu"
      />
      <mat-menu #beforeMenu="matMenu" xPosition="before">
        <button mat-menu-item (click)="openProfile()">Profile</button>
        <button mat-menu-item (click)="logout()">Logout</button>
      </mat-menu>
    </div>
  `,
  styles: [
    `
      .login-info-container {
        width: 100px;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;

        span {
          text-transform: capitalize;
          font-size: 16px;
        }

        img {
          cursor: pointer;
          height: 40px;
        }
      }
    `,
  ],
})
export class LoginInfoComponent implements OnInit {
  name!: string | null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    console.log(' need to implement logout');
    // this.router.navigate(['/']);
  }
}
