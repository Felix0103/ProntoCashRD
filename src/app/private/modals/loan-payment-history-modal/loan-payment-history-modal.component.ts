import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';
import { ReceiptPaymentModalComponent } from '../receipt-payment-modal/receipt-payment-modal.component';

@Component({
  selector: 'app-loan-payment-history-modal',
  templateUrl: './loan-payment-history-modal.component.html',
  styleUrls: ['./loan-payment-history-modal.component.scss'],
  standalone: false
})
export class LoanPaymentHistoryModalComponent  implements OnInit {
  @Input() loan: any;
  payments: any[] = [];
  constructor(    private loanService: LoanService ,   private modalCtrl: ModalController) { }

  ngOnInit() {
      this.loanService.getLoanPayments(this.loan.id).subscribe((resp:any)=>{
        this.payments = resp.data;
      });
  }
  close(){
    this.modalCtrl.dismiss(null);
  }
  async viewReceipt(payment: any){
      const modal = await this.modalCtrl.create({
          component: ReceiptPaymentModalComponent,
          animated: false,
          componentProps: { payment: payment },
        });
      await modal.present();
  }
  sentReceipt(payment: any){
    this.loanService.sendReceipt(payment);
  }
}
