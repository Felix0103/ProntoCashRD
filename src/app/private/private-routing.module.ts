import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionGuard } from '../core/guards/session.guard';
import { PrivateComponent } from './private.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserConfigComponent } from './user/user-config/user-config.component';
import { ClientComponent } from './client/client.component';
import { ListComponent } from './client/list/list.component';
import { NewComponent } from './client/new/new.component';
import { EditComponent } from './client/edit/edit.component';
import { LoanTypesComponent } from './loan-types/loan-types.component';
import { LoanTypeListComponent } from './loan-types/loan-type-list/loan-type-list.component';
import { LoanTypeNewComponent } from './loan-types/loan-type-new/loan-type-new.component';
import { LoanTypeEditComponent } from './loan-types/loan-type-edit/loan-type-edit.component';
import { LoanComponent } from './loan/loan.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanNewComponent } from './loan/loan-new/loan-new.component';
import { LoanEditComponent } from './loan/loan-edit/loan-edit.component';
import { LoanPendingComponent } from './loan/loan-pending/loan-pending.component';
import { PaymentsComponent } from './loan/payments/payments.component';


const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate:[SessionGuard],
    children:[
      {
        path:'home',
        component: DashboardComponent,
      },
      {
        path:'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'user',
        component: UserComponent,
        children: [
          {path:'', component: UserListComponent},
          {path: 'edit/:id', component: UserEditComponent},
          {path: 'config/:id', component: UserConfigComponent}
        ]
      },
      {
        path: 'clients',
        component: ClientComponent,
        children:[
          {path: '', component: ListComponent},
          {path: 'new', component: NewComponent} ,
          {path: 'edit/:id', component: EditComponent},
          {path: '**', redirectTo:'/clients', pathMatch:'full'}
        ]
      },
      {
        path: 'loan-types',
        component: LoanTypesComponent,
        children:[
          {path: '', component: LoanTypeListComponent},
          {path: 'new', component: LoanTypeNewComponent} ,
          {path: 'edit/:id', component: LoanTypeEditComponent},
          {path: '**', redirectTo:'/loan-types', pathMatch:'full'}
        ]
      },
       {
        path: 'loans',
        component: LoanComponent,
        children:[
          {path: '', component: LoanListComponent},
          {path: 'new', component: LoanNewComponent} ,
          {path: 'edit/:id', component: LoanEditComponent},
          {path: 'pending', component: LoanPendingComponent},
          {path: 'payments', component: PaymentsComponent},
          {path: '**', redirectTo:'/loans', pathMatch:'full'}
        ]
      }
    ]

  },
  {
    path: 'client-location-modal',
    loadChildren: () => import('./modals/client-location-modal/client-location-modal.module').then( m => m.ClientLocationModalPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
