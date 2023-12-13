import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/components/register/registration.component';
import { NotFoundComponent } from './core/pages/404-page.component';
import { LoginComponent } from './auth/components/login/login.component';
import { MainComponent } from './connections/components/main.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ProfilePageComponent } from './core/pages/profile-page.component';

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
    component: MainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    component: ProfilePageComponent,
    pathMatch: 'full',
  },
  // { path: 'second-component', component: SecondComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
