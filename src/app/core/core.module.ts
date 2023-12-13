import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { LoginInfoComponent } from './components/login-status-bar.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, LoginInfoComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [FooterComponent, HeaderComponent],
})
export class CoreModule {}
