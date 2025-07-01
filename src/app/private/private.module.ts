import { CustomerSearchModalComponent } from './modals/customer-search-modal/customer-search-modal.component';
import { LoanPaymentHistoryModalComponent } from './modals/loan-payment-history-modal/loan-payment-history-modal.component';
import { QuotasModalComponent } from './modals/quotas-modal/quotas-modal.component';

import { LoanTypeDetailModalComponent } from './loan-types/loan-type-detail-modal/loan-type-detail-modal.component';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { IonicModule } from '@ionic/angular';
import { ShellModule } from '../components/shell/shell.module';
import { ImageShellComponent } from '../components/shell/image-shell/image-shell.component';
import { AspectRatioComponent } from '../components/shell/aspect-ratio/aspect-ratio.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { UserComponent } from './user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserConfigComponent } from './user/user-config/user-config.component';

import { ListComponent } from './client/list/list.component';
import { ClientComponent } from './client/client.component';
import { NewComponent } from './client/new/new.component';
import { EditComponent } from './client/edit/edit.component';
import { LoanTypesComponent } from './loan-types/loan-types.component';
import { LoanTypeListComponent } from './loan-types/loan-type-list/loan-type-list.component';
import { LoanTypeNewComponent } from './loan-types/loan-type-new/loan-type-new.component';
import { LoanTypeEditComponent } from './loan-types/loan-type-edit/loan-type-edit.component';
import { LoanComponent } from './loan/loan.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanEditComponent } from './loan/loan-edit/loan-edit.component';
import { LoanNewComponent } from './loan/loan-new/loan-new.component';
import { CollectorSearchModalComponent } from './modals/collector-search-modal/collector-search-modal.component';
import { LoanPendingComponent } from './loan/loan-pending/loan-pending.component';
import { QuotasToPayModalComponent } from './modals/quotas-to-pay-modal/quotas-to-pay-modal.component';
import { ReceiptPaymentModalComponent } from './modals/receipt-payment-modal/receipt-payment-modal.component';
import { PaymentsComponent } from './loan/payments/payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    PrivateComponent,
    DashboardComponent,

    UserComponent,
    UserListComponent,
    UserEditComponent,
    UserConfigComponent,
    ListComponent,
    ClientComponent,
    NewComponent,
    EditComponent,
    LoanTypesComponent,
    LoanTypeListComponent,
    LoanTypeNewComponent,
    LoanTypeEditComponent,
    LoanTypeDetailModalComponent,
    LoanComponent,
    LoanListComponent,
    LoanEditComponent,
    LoanNewComponent,
    CustomerSearchModalComponent,
    CollectorSearchModalComponent,
    QuotasModalComponent,
    LoanPendingComponent,
    QuotasToPayModalComponent,
    LoanPaymentHistoryModalComponent,
    ReceiptPaymentModalComponent,
    PaymentsComponent

  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    ShellModule,
    FormsModule,
    NgxChartsModule
  ],

  bootstrap: [PrivateComponent],
  exports:[   ImageShellComponent,
    AspectRatioComponent]
})
export class PrivateModule { }
