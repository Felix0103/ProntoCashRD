import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoanPayment, LoanPaymentDetail } from 'src/app/core/interfaces/loan-payment';
import { LoanService } from 'src/app/core/services/loan.service';


@Component({
  selector: 'app-receipt-payment-modal',
  templateUrl: './receipt-payment-modal.component.html',
  styleUrls: ['./receipt-payment-modal.component.scss'],
  standalone: false
})
export class ReceiptPaymentModalComponent  implements OnInit {
  @Input() payment!: LoanPayment;
  constructor(    private modalCtrl: ModalController, private loanservice: LoanService) { }

  ngOnInit() {}
  print() {
    this.loanservice.printReceipt(this.payment);
  }
  close(){
       this.modalCtrl.dismiss(null);
  }
  sentReceipt(){
    this.loanservice.sendReceipt(this.payment);
  }
}
