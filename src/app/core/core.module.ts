import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { LoginInfoComponent } from './components/login-status-bar.component';
import { ProfilePageComponent } from './pages/profile-page.component';
import { DateService } from './services/data.service';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginInfoComponent,
    ProfilePageComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule, AuthModule],
  exports: [FooterComponent, HeaderComponent],
  providers: [DatePipe, DateService],
})
export class CoreModule {}
