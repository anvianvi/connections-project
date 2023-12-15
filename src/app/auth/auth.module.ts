import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { RegistrationComponent } from './components/register/registration.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [CommonModule, SharedModule],

  declarations: [LoginComponent, RegistrationComponent],
})
export class AuthModule {}
