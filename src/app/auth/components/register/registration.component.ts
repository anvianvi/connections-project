import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RegistrationService } from '../services/regestration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  isSubmitting = false;

  private authSubscription: Subscription | undefined;
  isAuthenticated$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
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
        () => {
          console.log('Registration successful');
        },
        (error) => {
          console.error('Registration failed', error);
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
