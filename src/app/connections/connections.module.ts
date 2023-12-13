import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './components/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, SharedModule],
  exports: [MainComponent],
  providers: [AuthService],
})
export class ConnectionsModule {}
