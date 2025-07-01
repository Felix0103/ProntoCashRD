import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-loan-type-detail-modal',
  templateUrl: './loan-type-detail-modal.component.html',
  styleUrls: ['./loan-type-detail-modal.component.scss'],
  standalone: false
})
export class LoanTypeDetailModalComponent  implements OnInit {
  @Input() loanType: any = null;
  detailForm: FormGroup;
    constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
  ) {
    this.detailForm = this.fb.group({
      total_quotas: ['', Validators.required],
      loan_amount: ['', Validators.required],
      quota_amount: ['', Validators.required],
      description: [''],
      loan_type_id: [''],
    });
  }


  ngOnInit() {}
 async save(){
  const newDetail =   this.detailForm.value;

    if (!newDetail.total_quotas || !newDetail.loan_amount || !newDetail.quota_amount ) {
           const toast = await this.toastCtrl.create({
          message: 'Debes completar todos los campos obligatorios para continuar',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      return;
    }
    if(  this.loanType.min_amount > newDetail.loan_amount){
          const toast = await this.toastCtrl.create({
          message: `El monto del prestamo no puede ser menor a ${this.loanType.min_amount}` ,
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      return;
    }
    if(  this.loanType.max_amount < newDetail.loan_amount){
          const toast = await this.toastCtrl.create({
          message: `El monto del prestamo no puede ser mayor a ${this.loanType.max_amount}` ,
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      return;
    }

    this.modalCtrl.dismiss(newDetail);
  }
  cancel(){
     this.modalCtrl.dismiss(null);
  }
}
