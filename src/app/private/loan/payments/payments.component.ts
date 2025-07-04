import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { ReceiptPaymentModalComponent } from '../../modals/receipt-payment-modal/receipt-payment-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: false
})
export class PaymentsComponent  implements OnInit {
  startDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  endDate = new Date().toISOString().split('T')[0];
  payments: any[] = [];
   date_start:any;
   date_end:any;
  totalCollected =0;
  constructor(private loanService: LoanService, private modalCtrl: ModalController) { }

  ngOnInit() {
     this.search();
  }
  search(){
   this.loanService.getLoanPaymentsByDateRange(this.startDate,this.endDate).subscribe((resp:any)=>{
      this.payments=resp.data;
      this.totalCollected = this.payments.reduce( (total: number, pago: any) =>  total + (+ pago.total_amount), 0 )
    })
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
  datePickStart(){

    this.startDate = this.date_start.substring(0, 10);
  }
  datePickEnd(){

    this.endDate = this.date_end.substring(0, 10);
  }
  printPayments(){
     this.loanService.printPayments(this.startDate, this.endDate, this.payments, this.totalCollected );
  }
}
