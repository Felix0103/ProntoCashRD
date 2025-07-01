import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NoSessionGuard } from '../core/guards/no-session.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent, canActivate: [NoSessionGuard]
  },
  {
    path: 'register',
    component: RegisterComponent, canActivate: [NoSessionGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
