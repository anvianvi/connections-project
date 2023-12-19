import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './pages/main-page.component';
import { GroupSectionComponent } from './components/group-section.component';
import { GrupCardComponent } from './components/group-element.component';
import { CreateGroupModalComponent } from './components/create-groupe-modal.component';
import { UserSectionComponent } from './components/user-section.component';
import { ConversationCardComponent } from './components/conversation-element.component';
import { GroupDialogPageComponent } from './pages/group-dialog-page.component';
import { ConversationPageComponent } from './pages/conversation-page.component';

@NgModule({
  declarations: [
    MainPageComponent,
    GroupSectionComponent,
    GrupCardComponent,
    CreateGroupModalComponent,
    UserSectionComponent,
    ConversationCardComponent,
    GroupDialogPageComponent,
    ConversationPageComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [MainPageComponent],
  providers: [AuthService],
})
export class ConnectionsModule {}
