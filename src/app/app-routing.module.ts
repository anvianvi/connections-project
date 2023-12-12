import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/components/register/registration.component';
import { NotFoundComponent } from './core/pages/404-page.component';

const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    component: RegistrationComponent,
    pathMatch: 'full',
  },
  // { path: 'second-component', component: SecondComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
