import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

// import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated$!: Observable<boolean>;
  private authSubscription: Subscription | undefined;

  constructor(
    // private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.isAuthenticated$ = this.authService.isLoggedIn;
    // this.isAuthenticated$.subscribe((isLoggedIn) => {
    //   if (isLoggedIn) {
    //     this.router.navigate(["/main"]);
    //   }
    // });
  }

  hide = true;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      // this.authService.login(this.form.value.email, this.form.value.password);

      this.authSubscription = this.isAuthenticated$.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/main']);
        } else {
          this.snackBar.open('Invalid email or password', 'OK', {
            duration: 3000,
            panelClass: ['mat-error'],
          });
        }
      });
    }
  }

  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
