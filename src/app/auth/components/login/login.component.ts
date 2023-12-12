import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LogInService } from '../../services/login.service';
import { LoginResponse } from 'src/app/shared/interfaces/interfaces';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated$!: Observable<boolean>;
  private authSubscription: Subscription | undefined;
  isSubmitting = false;

  constructor(
    private loginService: LogInService,
    private authService: AuthService,
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
  }

  hide = true;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.loginService
        .login(this.form.value.email, this.form.value.password)
        .subscribe(
          (response: HttpResponse<LoginResponse>) => {
            if (response.status === 200 && response.body) {
              this.authService.login(
                response.body.token,
                response.body.uid,
                this.form.value.email
              );

              this.snackBar.open('LogIn successful!', 'OK', {
                duration: 2000,
                panelClass: ['mat-accent'],
              });
              this.router.navigate(['/']);
              this.isSubmitting = false;
            }
          },
          (error) => {
            this.snackBar.open(
              `Registration failed!${error.error.type}: ${error.error.message}`,
              'OK',
              {
                duration: 3000,
                panelClass: ['mat-error'],
              }
            );
            this.isSubmitting = false;
          }
        );
    }
  }

  // @Output() submitEM = new EventEmitter();

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
