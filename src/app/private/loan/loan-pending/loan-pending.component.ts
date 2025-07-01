import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { QuotasToPayModalComponent } from '../../modals/quotas-to-pay-modal/quotas-to-pay-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-loan-pending',
  templateUrl: './loan-pending.component.html',
  styleUrls: ['./loan-pending.component.scss'],
  standalone: false
})
export class LoanPendingComponent  implements OnInit {
  loans: any[] =[];
  filter = '';
  isLoading = true;
  constructor(private loanService: LoanService, private modalCtrl: ModalController) { }

  ngOnInit() {
     this.loadLoans();
  }
   loadLoans(event?: any) {

      this.loanService.getLoansWithPendingPayment().subscribe({
        next: (data)=>{
          this.loans = data.data;
            this.isLoading = false;
          if (event) event.target.complete();
        },error:(err)=>{
           this.isLoading = false;
           if (event) event.target.complete();
        }
      });

  }
  loanFiltered() {
    return this.loans.filter(c =>
     `${c.client.first_name} ${c.client.last_name}`.toLowerCase().includes(this.filter.toLowerCase()) ||
      c.identification?.toLowerCase().includes(this.filter.toLowerCase())
    );
  }
  async showPayment( loan: any){
    const modal = await this.modalCtrl.create({
        component: QuotasToPayModalComponent,
        animated: false,
        componentProps: { loan:loan },
      });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.loadLoans();
  }
}
