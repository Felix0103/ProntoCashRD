import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuotasToPayModalComponent } from '../quotas-to-pay-modal/quotas-to-pay-modal.component';

@Component({
  selector: 'app-quotas-modal',
  templateUrl: './quotas-modal.component.html',
  styleUrls: ['./quotas-modal.component.scss'],
  standalone: false
})
export class QuotasModalComponent  implements OnInit {
  @Input() loan: any;
  loanDetails: any[] =[];
  today = this.toDateOnly(new Date());
  constructor(private modalCtrl: ModalController,) {


  }

  ngOnInit() {
    this.loanDetails = this.loan.details.filter((x:any)=> x.active ===1);
  }
  close(){
       this.modalCtrl.dismiss(null);
  }
  quotaInArrears(quota: any){
    const parts = quota.due_date.split('-');
    const dueDate = this.toDateOnly(new Date(+parts[0], +parts[1] - 1, +parts[2]));
    return quota.paid ===0 && dueDate < this.today && quota.active ===1;
  }
   quotaToPay(quota: any){
    const parts = quota.due_date.split('-');
    const dueDate = this.toDateOnly(new Date(+parts[0], +parts[1] - 1, +parts[2]));
    return quota.paid ===0 && dueDate.getTime() === this.today.getTime() && quota.active ===1;
  }
  toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  async showPayment(totalToPay: number){
    const modal = await this.modalCtrl.create({
        component: QuotasToPayModalComponent,
        animated: false,
        componentProps: { loan: this.loan, totalToPay: totalToPay },
      });
    await modal.present();
  }
}
