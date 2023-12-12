import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

// import { UserService } from "../shared/services/user.service";
// import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from './components/register/registration.component';

@NgModule({
  // providers: [UserService],
  imports: [CommonModule, SharedModule],

  declarations: [RegistrationComponent],
})
export class AuthModule {}
