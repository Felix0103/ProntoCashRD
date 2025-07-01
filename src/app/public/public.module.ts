import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordComponent } from '../components/show-hide-password/show-hide-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ShowNetworkStatusComponent } from '../components/show-network-status/show-network-status.component';


@NgModule({
  declarations: [
  ShowHidePasswordComponent, LoginComponent, RegisterComponent, ShowNetworkStatusComponent
  ],
  imports: [
    PublicRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    HttpClientModule, ToastrModule.forRoot({  positionClass: 'toast-top-center'}),


  ],
  exports:[

  ]
})
export class PublicModule { }
