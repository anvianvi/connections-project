import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/components/register/registration.component';
import { NotFoundComponent } from './core/pages/404-page.component';
import { LoginComponent } from './auth/components/login/login.component';
import { MainPageComponent } from './connections/pages/main-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ProfilePageComponent } from './core/pages/profile-page.component';
import { GroupDialogPageComponent } from './connections/pages/group-dialog-page.component';

const routes: Routes = [
  {
    path: 'signin',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    component: RegistrationComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./connections/connections.module').then(
        (m) => m.ConnectionsModule
      ),
    component: MainPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'group/:groupID',
    loadChildren: () =>
      import('./connections/connections.module').then(
        (m) => m.ConnectionsModule
      ),
    component: GroupDialogPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    component: ProfilePageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
