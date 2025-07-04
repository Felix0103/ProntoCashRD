import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';
import { QuotasModalComponent } from '../../modals/quotas-modal/quotas-modal.component';
import { QuotasToPayModalComponent } from '../../modals/quotas-to-pay-modal/quotas-to-pay-modal.component';
import { LoanPaymentHistoryModalComponent } from '../../modals/loan-payment-history-modal/loan-payment-history-modal.component';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
  standalone: false
})
export class LoanListComponent  implements OnInit {
  loans: any[] =[];
  filter = '';
  isLoading = true;
  today = this.toDateOnly( new Date());
  constructor(private loanService: LoanService, private navCtrl: NavController,
     private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans(event?: any) {

      this.loanService.getLoans().subscribe({
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
  newLoan(){
    this.navCtrl.navigateRoot('/loans/new');
  }
  editLoan(loanId: number){
    this.navCtrl.navigateRoot(['/loans/edit', loanId]);
  }
  quotaPending(loan: any){
      return loan.details.filter( (x:any)=> x.paid ===0 && x.active ===1).length;
  }
  quotaInArrears(loan: any){

    if(loan.active ===0 ) return false;
      return loan.details.filter( (x:any)=> {
        const parts = x.due_date.split('-');
        const dueDate = this.toDateOnly(new Date(+parts[0], +parts[1] - 1, +parts[2]));
        return x.paid ===0 && dueDate.getTime() < this.today.getTime() && x.active ===1}).length;
  }
  async showQuotas(loan: any){
    const modal = await this.modalCtrl.create({
        component: QuotasModalComponent,
        animated: false,
        componentProps: { loan: loan },
      });
    await modal.present();
  }
  async showQuotastoPay(loan: any){
    const modal = await this.modalCtrl.create({
        component: QuotasModalComponent,
        animated: false,
        componentProps: { loan: loan },
      });
    await modal.present();
  }
  toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  async showPayment(loan: any){
    const modal = await this.modalCtrl.create({
        component: QuotasToPayModalComponent,
        animated: false,
        componentProps: { loan: loan },
      });
    await modal.present();
    this.loadLoans();
  }
  async showPaymentHistory(loan: any){
    const modal = await this.modalCtrl.create({
        component: LoanPaymentHistoryModalComponent,
        animated: false,
        componentProps: { loan: loan },
      });
    await modal.present();
  }
  async refinanceLoan(loan: any){
    const client = loan.client;
    const totalPrestamo = Number(loan.loan_type_detail.loan_amount);
    const totalToPay= Number(loan.loan_type_detail.quota_amount)*Number(loan.loan_type_detail.total_quotas);
    const totalDue = Number(loan.overdue_amount);

    if(totalDue >(totalToPay-totalPrestamo) ){
           const toast = await this.toastCtrl.create({
            message: 'No puedes reenganchar prestamos sin pagar el capital',
            duration: 2000,
            color: 'warning'
          });
          toast.present();
      return;
    }

     this.navCtrl.navigateRoot(['/loans/new'], { queryParams: {
        old_loan_id: loan.id,
        overdue_amount: loan.overdue_amount,
        client_id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        credit_limit: client.credit_limit,
        loan_type_id: loan.loan_type_id,
        loan_type_detail_id: loan.loan_type_detail_id,
        collector_id: loan.collector_id
      }
    } );
  }
}
