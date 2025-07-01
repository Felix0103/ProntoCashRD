import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientLocationModalPageRoutingModule } from './client-location-modal-routing.module';

import { ClientLocationModalPage } from './client-location-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientLocationModalPageRoutingModule
  ],
  declarations: [ClientLocationModalPage],
})
export class ClientLocationModalPageModule {}
