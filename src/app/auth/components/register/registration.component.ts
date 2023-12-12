import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RegistrationService } from '../../services/regestration.service';
import { HttpResponse } from '@angular/common/http';
import { RegistrationResponse } from 'src/app/shared/interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  isSubmitting = false;
  alreadyExistsEmails: string[] = [];
  isEmailTaken = false;

  isAuthenticated$!: Observable<boolean>;
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  createForm() {
    this.registrationForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            this.emailAlreadyExistsValidator(),
          ],
        ],
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(40),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            RegistrationComponent.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: RegistrationComponent.passwordMatchValidator }
    );
  }

  emailAlreadyExistsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const enteredEmail = control.value as string;

      if (this.alreadyExistsEmails.includes(enteredEmail)) {
        this.isEmailTaken = true;
        return { emailExists: true };
      }

      this.isEmailTaken = false;
      return null;
    };
  }

  get nameControl(): AbstractControl | null {
    return this.registrationForm.get('name');
  }

  static passwordStrengthValidator(
    control: AbstractControl
  ): { [key: string]: unknown } | null {
    const { value } = control;
    const hasMinLength = value && value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /(?=.*\W)/.test(value);
    const isStrongPassword =
      hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
    return isStrongPassword ? null : { weakPassword: true };
  }

  static passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: unknown } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getPasswordRecommendations(): string[] {
    const value = this.registrationForm.get('password')?.value || '';
    const recommendations: string[] = [];

    if (value.length < 8) {
      recommendations.push('Must be at least 8 characters long');
    }

    const hasUpperCase = /[A-Z]/.test(value);
    if (!hasUpperCase) {
      recommendations.push('Must include at least one uppercase letter');
    }

    const hasNumber = /\d/.test(value);
    if (!hasNumber) {
      recommendations.push('Must include at least one digit');
    }

    const hasSpecialChar = /(?=.*\W)/.test(value);
    if (!hasSpecialChar) {
      recommendations.push(
        'Must include at least one special character (!@#?)'
      );
    }

    return recommendations;
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.registrationForm.value;

      this.registrationService.registerUser(formData).subscribe(
        (response: HttpResponse<RegistrationResponse>) => {
          if (response.status === 201) {
            this.snackBar.open('Registration successful!', 'OK', {
              duration: 2000,
              panelClass: ['mat-accent'],
              horizontalPosition: 'right',
            });
            this.router.navigate(['/signin']);
            this.isSubmitting = false;
          }
        },
        (error) => {
          if (
            error.error &&
            error.error.type === 'PrimaryDuplicationException'
          ) {
            this.isEmailTaken = true;
            this.registrationForm.get('email')?.setErrors({ taken: true });
            this.alreadyExistsEmails.push(formData.email);
          }

          this.snackBar.open(
            `Registration failed: ${error.error.message}`,
            'OK',
            {
              duration: 4000,
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
