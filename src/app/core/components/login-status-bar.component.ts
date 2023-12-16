import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LogoutService } from '../services/logout.service';
import { ServerResponse } from 'src/app/shared/interfaces/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

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
        <button mat-menu-item (click)="logout()" [disabled]="isFetching">
          Logout
        </button>
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
  isFetching: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private logoutService: LogoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.isFetching = true;

    this.logoutService.logout().subscribe(
      (response: ServerResponse) => {
        if (response.status === 200) {
          this.snackBar.open('Logout successful, we will miss you! ', 'OK', {
            duration: 10000,
            panelClass: ['mat-accent'],
            horizontalPosition: 'right',
          });
          this.isFetching = false;

          this.authService.logout();
          sessionStorage.clear();
          localStorage.clear();
          document.cookie.split(';').forEach((cookie) => {
            const [name] = cookie.split('=');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
          location.reload();
        }
      },
      (error) => {
        this.snackBar.open(`Uups smth go wrong ${error.message}`, 'OK', {
          duration: 5000,
          panelClass: ['mat-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.isFetching = false;
      }
    );
  }
}
