import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LogInService } from '../../services/login.service';
import { LoginResponse } from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated$!: Observable<boolean>;
  private authSubscription: Subscription | undefined;
  isSubmitting = false;
  public errorType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LogInService,
    private authService: AuthService,
    private profileServise: ProfileService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
    this.form.valueChanges.subscribe(() => {
      this.errorType = null;
    });
  }

  hide = true;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.loginService
        .login(this.form.value.email, this.form.value.password)
        .subscribe(
          (response: HttpResponse<LoginResponse>) => {
            if (response.status === 200 && response.body) {
              localStorage.clear();

              this.authService.login(
                response.body.token,
                response.body.uid,
                this.form.value.email
              );

              this.profileServise.fetchProfileInfo();

              this.snackBar.open('LogIn successful!', 'OK', {
                duration: 2000,
                panelClass: ['mat-accent'],
                horizontalPosition: 'right',
              });

              this.router.navigate(['/']);
              this.isSubmitting = false;
            }
          },
          (error) => {
            this.errorType = error.error.type;

            this.snackBar.open(
              `Registration failed! ${error.error.message}`,
              'OK',
              {
                duration: 5000,
                panelClass: ['mat-error'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
            this.isSubmitting = false;
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
