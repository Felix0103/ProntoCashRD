
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';
import { ReceiptPaymentModalComponent } from '../receipt-payment-modal/receipt-payment-modal.component';

@Component({
  selector: 'app-quotas-to-pay-modal',
  templateUrl: './quotas-to-pay-modal.component.html',
  styleUrls: ['./quotas-to-pay-modal.component.scss'],
  standalone: false
})
export class QuotasToPayModalComponent  implements OnInit {
  @Input() loan: any;
  @Input() totalToPay: number =0;
  formPayment: FormGroup;
  today = this.toDateOnly(new Date());

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService ,
    private toast: ToastController,
    private modalCtrl: ModalController
  ) {
    this.formPayment = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });

  }

  ngOnInit() {
    const due = this.loan.details.filter( (x:any)=> {
      const parts = x.due_date.split('-');
      const dueDate = this.toDateOnly(new Date(+parts[0], +parts[1] - 1, +parts[2]));
       return x.paid ===0 && dueDate.getTime() <= this.today.getTime() && x.active ===1;
    }).reduce((total: number, quota: any) => total + (quota.amount-quota.paid_amount), 0);

    this.formPayment.patchValue({amount: this.totalToPay> 0? this.totalToPay:due});
  }


  submit() {
    if (this.formPayment.invalid || !this.loan?.id) return;

    const payload = {
      loan_id: Number(this.loan.id),
      amount: Number(this.formPayment.value.amount),
    };

    this.loanService.storePayment(payload).subscribe({
      next: async (resp: any) => {
        const toast = await this.toast.create({
          message: 'Pago registrado con éxito.',
          duration: 2000,
          color: 'success',
        });
        toast.present();

        this.modalCtrl.dismiss(null).then(()=> this.viewReceipt(resp.data));

      },
      error: async (err) => {
        const toast = await this.toast.create({
          message: 'Error al registrar el pago.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }
  toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

}
