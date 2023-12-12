import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

// import { UserService } from "../shared/services/user.service";
import { RegistrationComponent } from './components/register/registration.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  // providers: [UserService],
  imports: [CommonModule, SharedModule],

  declarations: [LoginComponent, RegistrationComponent],
})
export class AuthModule {}
