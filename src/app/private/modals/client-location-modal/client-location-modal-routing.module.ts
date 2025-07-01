import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientLocationModalPage } from './client-location-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ClientLocationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientLocationModalPageRoutingModule {}
